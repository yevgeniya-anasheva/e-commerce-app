let created = 0;
let category =
{
    fakeDB : [],
    init()
    {
        this.fakeDB.push({
            title: "Paper & Sketchbooks",
            img: "img/img1.jpg"
        });
    
        this.fakeDB.push({
            title: "Notebooks & Planners",
            img: "/img/img2.jpg"
        });
    
        this.fakeDB.push({
            title: "Watercolour",
            img: "/img/img3.jpg"
        });

        this.fakeDB.push({
            title: "Oil paint",
            img: "/img/img4.jpg"
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

module.exports = category;