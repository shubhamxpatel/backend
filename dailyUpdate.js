const MongoClient = require('mongodb').MongoClient;
const fetch = require('node-fetch')
const uri = "mongodb+srv://shubhamp:Kumar@123@cluster0.n5lab.mongodb.net/test?retryWrites=true&w=majority";
var db;
var arr = []
var count;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function get(img_url, s) {
    let reg = new RegExp(s, 'i')
        //console.log(reg)
    for (let x of img_url) {
        //console.log(x[0])
        let p = await x[0].match(reg)
            // console.log(p)
        if (p) {
            //   console.log(x[1])
            return `https:${x[1]}`
        }
    }
    return ""
}
async function getimdbId(s) {

    let q = s
    console.log(`https://www.google.com/search?q=${(q+" imdb").split(" ").join("+")}`)
    let result = await fetch(`https://www.google.com/search?q=${(q+" imdb").split(" ").join("+")}`);
    let text1 = await result.text()
    let m = text1.match(/\<a.*?href="\/url\?q=https:\/\/www.imdb.com\/name\/(.*?)\//)
        //console.log(text1)
    if (m) {
        return `https://www.imdb.com/name/${m[1]}`
    }
    return ""
}
async function addActor(s) {

    let query = await getimdbId(s)
    if (query !== "") {
        let result = await fetch(query)
        let text = await result.text()
            //console.log(text)
        let img_url1 = text.match(/\<img id="name-poster"(\s|.)*?src="(.*?)"/)
            //let img_url = await get(img_url1)
        let img_url = (img_url1) ? img_url1[2] : "";
        console.log(img_url, s)

        client.db().collection("actors").insertOne({ name: s, img_url: img_url, wiki_link: `${query}` }, (err, res) => { /*console.log(res, err) */ })
    }


}

async function getTrailer(query) {
    //return query
    let ans = await fetch(`https://www.google.com/search?q=${query+" movie trailer"}`).then(async res => {
        console.log(query)
        let text = await res.text()
        let result = text.matchAll(/href=".*?"/g)
        let arr1 = []
        for (x of result) { arr1.push(unescape(x[0])) }
        for (let p of arr1) {
            if (p.match(/https:\/\/www\.youtube\.com.*?"/g)) {
                let x = `${p.match(/watch\?v=(.*?)&/)[1]}`
                    //console.log(`https://www.youtube.com/embed/${x}`, " 1")
                return `https://www.youtube.com/embed/${x}`;
            }
        }
        return ""

    })
    return ans;
}
async function fun(movie) {
    let result = await fetch(`http://www.omdbapi.com/?i=tt3896198&apikey=ad2b8365&t=${movie}`)
    let text;
    try {
        text = await result.json();
    } catch (error) {
        console.log(error, "json error occured")
    }

    if (text && text.Title) {
        let movie_db = {
            movie_name: text.Title,
            movie_lang: (text.Language) ? text.Language.split(", ") : [],
            movie_actors: (text.Actors) ? text.Actors.split(", ") : [],
            movie_gener: (text.Genre) ? text.Genre.split(", ") : [],
            like: 0,
            dislike: 0,
            admin: "shubham patel",
            story: text.Plot,
            createTime: new Date(),
            director_name: text.Director,
            release_date: new Date(text.Released),
            page_visited: 0,
            run_time: parseInt((text.Runtime) ? text.Runtime.split(" ")[0] : "not found")


        }
        for (let x in movie_db) {
            if (typeof(movie_db[x]) === "string") {
                movie_db[x] = movie_db[x].toLowerCase()
            }
            if (typeof(movie_db[x]) === "object") {
                for (let i = 0; i < movie_db[x].length; i++) {
                    movie_db[x][i] = movie_db[x][i].toLowerCase()
                }
            }

        }
        // console.log(text.Released)
        await getTrailer(movie_db.movie_name + " " + text.Released.split(" ")[2]).then(async trailer => {

            movie_db.movie_trailer = trailer
            movie_db.poster_url = text.Poster

            //console.log(movie_db)

            db.collection("movies").insertOne(movie_db, async(err, res) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log(movie_db.movie_name + " inserted into mongo database")
                    for (let r of movie_db.movie_actors) {
                        await addActor(r);
                        console.log(r)
                    }


                }


            })


        })

    }
    count++;
    console.log(count)
    if (count < arr.length) {
        fun(arr[count])
    } else {
        await db.collection("pendingmovies").deleteMany({}).then(() => {
            client.close();
            console.log('connection closed')
        })
    }
}
async function pendingmovie() {
    await client.connect(async err => {
        db = client.db("test")
        console.log('connected')
            //pendingmovie()

        arr = []
        let result = await db.collection('pendingmovies').find({})
        await result.toArray().then(mv => {

            for (let xr of mv) {
                arr.push(xr.name);
                console.log(xr)
            }
        })
        if (arr.length > 0) {
            count = 0;
            fun(arr[count])
        } else {
            console.log('connection closed')
            client.close()
        }
    });



}
module.exports = pendingmovie