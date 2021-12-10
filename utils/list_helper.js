const blogs = [
    {
      _id: "5a422a851b54a676234d17f7",
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
      __v: 0
    },
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0
    },
    {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0
    },
    {
      _id: "5a422b891b54a676234d17fa",
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 10,
      __v: 0
    },
    {
      _id: "5a422ba71b54a676234d17fb",
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
      likes: 0,
      __v: 0
    },
    {
      _id: "5a422bc61b54a676234d17fc",
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2,
      __v: 0
    }  
  ]



const dummy = (blogs) => {
   return 1
}

const totalLikes = (blogs) => {
    const reducer = (sum, item) => {
        return sum + item.likes
    }
    
    return blogs.length === 0
        ? 0
        : blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    const reducer = (prev, current) => Math.max(prev, current.likes)

    return blogs.length === 0 
        ? 0
        : blogs.reduce(reducer, 0)
}

const mostBlogs = (blogs) => {
    
    let result = {}
    let countedBlogPosts = {}
    
    for (let i = 0; i < blogs.length; i++) {
        let num = blogs[i]
        
        if (countedBlogPosts[num.author]) {
            countedBlogPosts[num.author]++
        } else {
            countedBlogPosts[num.author] = 1
        }
    }

    let arrayOfAuthors = Object.entries(countedBlogPosts)
    arrayOfAuthors.sort((a,b) => b[1] - a[1])

    result.author = arrayOfAuthors[0][0]
    result.blogs = arrayOfAuthors[0][1]

    return result
}

const mostLikes = (blogs) => {
    
    let result = {}
    
    let sortedList = blogs.sort((a,b) => b.likes - a.likes )

    result.author = sortedList[0].author
    result.likes = sortedList[0].likes

    return result
}
  
module.exports = {
    blogs,
    dummy, 
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}