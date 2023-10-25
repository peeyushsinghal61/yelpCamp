const express = require('express');
const router = express.Router();
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
const {campgroundSchema, reviewSchema} = require('../schemas');
const Campground = require('../models/campground');
const isLoggedIn = require('../middleware')

const validateCampground = function(req,res,next){
    const {error} = campgroundSchema.validate(req.body)
    if(error){
        const message = error.details.map(function(e){
            return e.message}).join(',')
        throw new ExpressError(message,400)
    }else{
        next();
    }
}

router.get('/', catchAsync(async function(req,res){
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
}))

router.get('/new',isLoggedIn, function(req,res){
    res.render('campgrounds/new')
})

router.post('/',isLoggedIn, validateCampground, catchAsync(async function(req,res,next){
  
    const campground = new Campground(req.body.campground)
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new campground!!!')
    res.redirect(`/campgrounds/${campground._id}`)
    
}))

router.get('/:id', catchAsync(async function(req,res){
    
    const campground = await Campground.findById(req.params.id).populate('reviews').populate('author');
    if(!campground){
        req.flash('error', 'Cannot find the campground')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', {campground})
}))


router.get('/:id/edit',isLoggedIn, catchAsync(async function(req,res){
    const campground = await Campground.findById(req.params.id)
    if(!campground){
        req.flash('error', 'Cannot find the campground')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', {campground})
}))

router.put('/:id',isLoggedIn, validateCampground, catchAsync(async function(req,res){
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground})
    req.flash('success', 'Successfully updated campground')
    res.redirect(`/campgrounds/${campground._id}`)

}))

router.delete('/:id',isLoggedIn, catchAsync(async function(req,res){
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted a campground')
    res.redirect('/campgrounds')
}))


module.exports = router;