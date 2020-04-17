let created = 0;
const bestseller =
{
    fakeDB : [],
    init()
    {
        this.fakeDB.push({
            title: "Strathmore Art Sketchbook",
            img: "img/img5.jpg"
        });
    
        this.fakeDB.push({
            title: "Arteza Brush Pens",
            img: "img/img6.jpg"
        });
    
        this.fakeDB.push({
            title: "Orange Circle Planner",
            img: "/img/img7.jpg"
        });

        this.fakeDB.push({
            title: "Dual brush pens",
            img: "/img/img8.jpg"
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

module.exports = bestseller;