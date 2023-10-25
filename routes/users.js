const express = require('express');
const router = express.Router();
const passport = require('passport')
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user')


router.get('/register', function(req,res){
    res.render('users/register')
})

router.post('/register', catchAsync(async function(req,res,next){
    try{
    const {username,email,password} = req.body;
    const user = new User({username, email})
    const registeredUser = await User.register(user, password)
    req.login(registeredUser, function(err){
        if(err){next(err)};
        req.flash('success', 'welcome to yelp-camp')
    res.redirect('/campgrounds')
    })
}
    catch(e){
        req.flash('error', e.message)
        res.redirect('/register')
    }
}))

router.get('/login', function(req,res){
    res.render('users/login')
})

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), function(req,res){
    req.flash('success', 'Welcome back to yelp-camp')
    const redirectUrl = req.session.returnTo || '/campgrounds'
    delete req.session.returnTo
    res.redirect(redirectUrl)
})

router.get('/logout', function(req,res,next){
    req.logout();
    req.flash('success', 'Logged out!')
    res.redirect('/campgrounds')
})
  
module.exports = router;