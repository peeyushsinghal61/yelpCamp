const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require("./cities");
const {places, descriptors} = require('./seedHelpers');


mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
    console.log('Connection Established!!');
});

const sample = function(arr){
    return arr[Math.floor(Math.random()*arr.length)]
}

const seedDb = async function(){
    await Campground.deleteMany({});
    for(let i =0;i<50;i++){
        const random1000 = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random()*20) + 10;
        const camp = new Campground ({
            author: '62b990635da32764d1426fc0',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/483251',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab recusandae consectetur laudantium molestias dolores quaerat placeat nobis, eligendi doloremque quos sit, odio, quae id et obcaecati illum distinctio reprehenderit repudiandae.',
            price

        })
        await camp.save();
    }

}

seedDb().then(function(){
    mongoose.connection.close();
})