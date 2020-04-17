//doesn't get uploaded when submitted together with categories

let created = 0;
let fakeProducts =
{
    fakeDB : [],
    init()
    {
        this.fakeDB.push({
            img: "img/img9.jpg",
            title: "Valentine's day notebook",
            price: '8.99',
            category: 'Notebooks & Planners',
            isBestseller: 'false'
        });
    
        this.fakeDB.push({
            img: "img/img8.jpg",
            title: "Dual brush pens",
            price: '19.99',
            category: 'Pencils & Pens',
            isBestseller: 'true'
        });
    
        this.fakeDB.push({
            img: "img/img10.jpg",
            title: "Faber Castell Colour Pencils",
            price: '49.99',
            category: 'Pencils & Pens',
            isBestseller: 'false'
        });

        this.fakeDB.push({
            img: "img/img5.jpg",
            title: "Strathmore Art Sketchbook",
            price: '13.99',
            category: 'Paper & Sketchbooks',
            isBestseller: 'true'
        });
        this.fakeDB.push({
            img: "img/img11.jpg",
            title: "Sakura Koi Watercolour",
            price: '30.99',
            category: 'Watercolour',
            isBestseller: 'false'
        });
        this.fakeDB.push({
            img: "img/img12.jpg",
            title: "Canson Sketchbook",
            price: '12.99',
            category: 'Paper & Sketchbooks',
            isBestseller: 'false'
        });
        this.fakeDB.push({
            img: "img/img13.jpg",
            title: "Derwent Oil paint 24clrs",
            price: '15.99',
            category: 'Oil paint',
            isBestseller: 'false'
        });
        created = 1;
    },
    getAll()
    {   
        //if we don't do this check the contents will be added every time the page is reloaded
        if(created == 0)
            this.init();
        return this.fakeDB;
    }
}

module.exports = fakeProducts;