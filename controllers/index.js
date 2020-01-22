const User =  require('../models/user');
const Project = require('../models/project');
const Article = require('../models/article')
const mapBoxToken = process.env.MAPBOX_TOKEN;
const util = require('util');
const { cloudinary } = require('../cloudinary');
const { deleteProfileImage } = require('../middleware');
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {
    async landingPage(req, res, next) {
		const projects = await Project.find({})
		const projectSwiper = await Project.find({}).limit( 9 );
		const articlesMain = await Article.find({}).limit(7);
		
		res.render('index', { projects,projectSwiper,articlesMain, mapBoxToken , title: 'Elapce главная страница' })
		
    },
    // get register
    getRegister(req, res, next) {
		res.render('register', {title: 'Register'})
		
    },
    async postRegister(req, res, next) {
		try {
			if(req.file) {
                const { secure_url, public_id} = req.file;
                req.body.image = { secure_url, public_id };
            }
			const user = await User.register(new User(req.body), req.body.password);
			req.login(user, function(err) {
				if (err) return next(err);
				req.session.success = `Добро пожаловать в Elapce, ${user.username}!`;
				res.redirect('/');
			});
		} catch(err) {
			deleteProfileImage(req);
			const { username, email } = req.body;
			let error = err.message;
			if (error.includes('duplicate') && error.includes('index: email_1 dup key')) {
				error = 'Пользователь с данным электронным адресом уже зарегистрирован!';
            }
            
			res.render('register', { title: 'Register', username, email, error });
		}
	},
    
    // get login
    getLogin(req, res, next) {
        if (req.isAuthenticated()) return res.redirect('/');
        if (req.query.returnTo) req.session.redirectTo = req.headers.referer;
        res.render('login', {title: 'Login'});

    },
    async postLogin(req, res, next) {
		const {username,password} = req.body;
		
		const {user, error} = await User.authenticate()(username, password);
		
		if(!user && error) return next(error);
		
        req.login(user, function(err) {
            if(err) return next(err);
            req.session.success = `Добро пожаловать, ${username}`;
            const redirectUrl = req.session.redirectTo || '/';
            delete req.session.redirectTo
            res.redirect(redirectUrl);
        })
    },
    getLogout(req, res, next) {
        req.logout();
        res.redirect('/');     
    },
    getContacts(req,res,next) {
		
        res.render('contacts', {title: 'Контакты'})
    },
    async getProfile(req,res,next) {
        res.render('profile', {title: 'Profile page'})
    },
    async updateProfile(req, res, next) {
		const {
			username,
			email
		} = req.body;
		const { user } = res.locals;
		if (username) user.username = username;
        if (email) user.email = email;
        if (req.file) {
            if( user.image.public_id ) await cloudinary.v2.uploader.destroy(user.image.public_id);
            const { secure_url, public_id } = req.file
            user.image = { secure_url, public_id }
        }
		await user.save();
		const login = util.promisify(req.login.bind(req));
		await login(user);
		req.session.success = 'Профиль успешно обновлен!';
		res.redirect('/profile');
    },
    getForgotPw(req, res, next) {
		res.render('users/forgot')
	},
	
	async putForgotPw(req, res, next) {
		const token = await crypto.randomBytes(20).toString('hex');
		const { email } = req.body;
		const user = await User.findOne({ email });
		if (!user) {
			res.session.error = 'Не существует аккаунта с данным электронным адресом.';
			return res.redirect('/forgot-password')
		}
		user.resetPasswordToken = token;
		user.resetPasswordExpires = Date.now() + 3600000;
		await user.save();

		const msg = {
			to: email,
			from: 'Elapce admin <admin@elapce.com>',
			subject: 'Elapce administrator, admin@elapce.com',
			text: `Вы получили это письмо в связи с запросом на 
            восстановление пароля для вашего аккаунта на сайте Elapce.com
            Пожалуйста перейдите по данной ссылке или скопируйте и вставьте в адресную 
            строку браузера: http://${req.headers.host}/reset/${token}
            Если Вы не запрашивали сброс пароля пожалуйста игнорируйте данное письмо`.replace(/		  /g, '').replace(/		  /g, ''),
			//html: '<strong>and easy to do anywhere, even with Node.js</strong>',
		};
		await sgMail.send(msg);

		req.session.success = `Электронное письмо с инструкциями было отправлено на Вашу почту: ${email}!`
		res.redirect('/forgot-password');
	},
	async getReset(req, res, next) {
		const { token } = req.params;
		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpires: { $gt: Date.now()}

		});
		if ( !user ) {
			req.session.error = 'Токен предоствленный вами неверный или срок его действия(60 минут) закончился!';
			return res.redirect('/forgot-password');
			
		}
		res.render('users/reset', {token})
	},
	async putReset(req, res, next) {
		const { token } = req.params;
		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpires: { $gt: Date.now() }
		});

		if (!user) {
			req.session.error = 'Токен предоствленный вами неверный или срок его действия(60 минут) закончился!';
			return res.redirect('/forgot-password');
		}

		if (req.body.password === req.body.confirm) {
			await user.setPassword(req.body.password);
			user.resetPasswordToken = null;
			user.resetPasswordExpires = null;
			await user.save();
			const login = util.promisify(req.login.bind(req));
			await login(user);
		} else {
			req.session.error = 'Пароль не найден.';
			return res.redirect(`/reset/${ token }`);
		}

		const msg = {
			to: user.email,
			from: 'Elapce admin <admin@elapce.com>',
			subject: 'Elapce - Запрос на изменение пароля',
			text: `Привет,
            Это электронное письмо подтверждает что пароль в Вашем аккаунте на сайте Elapce.com
            был изменен. Если Вы этого не делали - просим дать ответ на данное письмо.`.replace(/		  /g, '')
		};

		await sgMail.send(msg);
		req.session.success = 'Пароль был успешно обновлен!'

		res.redirect('/profile');
	},
	async postContactUs(req, res, next) {
		console.log(req.body.mobile)
		console.log(req.body.name)
		console.log(req.body.text)
		const msg = {
			to: 'infoelapce@gmail.com',
			from: 'Elapce admin <admin@elapce.com>',
			subject: 'Elapce - новая заявка, форма связаться с нами',
			text: `Новый клиент, ${req.body.name} ${req.body.mobile}.Сообщение: ${req.body.text}.`.replace(/		  /g, '')
		};

		await sgMail.send(msg);
		req.session.success = `Благодарим за доверие ${req.body.name}, наши менеджеры скоро свяжутся с Вами!`
		res.redirect('/');
	}

    
}