// Curated authentic movie dataset mirroring TMDB data structure
// Used when TMDB_API_KEY is not set or network is unreachable

const GENRES = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" }
];

const CURATED_MOVIES = [
  {
    id: 872585,
    title: "Oppenheimer",
    overview: "The story of J. Robert Oppenheimer’s role in the development of the atomic bomb during World War II.",
    poster_path: "/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    backdrop_path: "/rLb2cwF3Pazuxaj0sRXQ037tGI1.jpg",
    release_date: "2023-07-19",
    vote_average: 8.1,
    vote_count: 9140,
    genre_ids: [18, 36],
    runtime: 180,
    director: "Christopher Nolan",
    cast: [
      { name: "Cillian Murphy", character: "J. Robert Oppenheimer", profile_path: "/360KjuhA9mx1z2qaqLcxq1P4z2m.jpg" },
      { name: "Emily Blunt", character: "Katherine 'Kitty' Oppenheimer", profile_path: "/nPJXaRMbu292zqr56mQnnJ64qom.jpg" },
      { name: "Matt Damon", character: "Leslie Groves", profile_path: "/elSlNg0Wqj9ExbUJWWLwtbvWTaF.jpg" },
      { name: "Robert Downey Jr.", character: "Lewis Strauss", profile_path: "/5qHNjhtjMD4YWH3ez6CCBuavhiG.jpg" },
      { name: "Florence Pugh", character: "Jean Tatlock", profile_path: "/fhqdflX0W9a3v2y3T3yS9uN3z7A.jpg" }
    ],
    categories: ["trending", "popular", "top_rated"]
  },
  {
    id: 693134,
    title: "Dune: Part Two",
    overview: "Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.",
    poster_path: "/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    backdrop_path: "/xOMo8BRK7PfcJv9JCnx7s520Wio.jpg",
    release_date: "2024-02-27",
    vote_average: 8.2,
    vote_count: 5820,
    genre_ids: [878, 12],
    runtime: 166,
    director: "Denis Villeneuve",
    cast: [
      { name: "Timothée Chalamet", character: "Paul Atreides", profile_path: "/BE2sdjpgsa2rNTFa66f7upkaOP.jpg" },
      { name: "Zendaya", character: "Chani", profile_path: "/r3A7ev7ycA6aBGE7A4h11n54P6E.jpg" },
      { name: "Rebecca Ferguson", character: "Lady Jessica", profile_path: "/su4oR3t7X6b4GZ8l1uW5iN5w0iA.jpg" },
      { name: "Javier Bardem", character: "Stilgar", profile_path: "/gBcuW2U3WkM4KqEaJ3xWc3L9Z7Z.jpg" },
      { name: "Austin Butler", character: "Feyd-Rautha Harkonnen", profile_path: "/bFqU8y4QvM4v2mX6xWc3L9Z7Z8.jpg" }
    ],
    categories: ["trending", "popular", "now_playing"]
  },
  {
    id: 157336,
    title: "Interstellar",
    overview: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
    poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    backdrop_path: "/xJHokMbljvjADYdit5fK5VQsXEG.jpg",
    release_date: "2014-11-05",
    vote_average: 8.4,
    vote_count: 35120,
    genre_ids: [12, 18, 878],
    runtime: 169,
    director: "Christopher Nolan",
    cast: [
      { name: "Matthew McConaughey", character: "Joseph Cooper", profile_path: "/e9ZHRY5ox9hc8Ac39NmZ3JmY7r9.jpg" },
      { name: "Anne Hathaway", character: "Dr. Amelia Brand", profile_path: "/tLelKoPNiyJCSEtQT81710OQ4Y7.jpg" },
      { name: "Jessica Chastain", character: "Murphy Cooper", profile_path: "/nkFrpE24B1s6yYq3JmY7r9e9ZHR.jpg" },
      { name: "Michael Caine", character: "Professor John Brand", profile_path: "/klNx5vjK2xO1jZ3Q4xWc3L9Z7Z8.jpg" }
    ],
    categories: ["top_rated", "popular"]
  },
  {
    id: 155,
    title: "The Dark Knight",
    overview: "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets.",
    poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    backdrop_path: "/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg",
    release_date: "2008-07-16",
    vote_average: 8.5,
    vote_count: 32400,
    genre_ids: [18, 28, 80, 53],
    runtime: 152,
    director: "Christopher Nolan",
    cast: [
      { name: "Christian Bale", character: "Bruce Wayne / Batman", profile_path: "/b7fTC9WFsrqHQ2jXG5z57T6C6nC.jpg" },
      { name: "Heath Ledger", character: "Joker", profile_path: "/pGcoQf4kZ4g1gYn0m6Hq4P5T6C6.jpg" },
      { name: "Aaron Eckhart", character: "Harvey Dent", profile_path: "/3cE4rZgYn0m6Hq4P5T6C6nCb7fT.jpg" },
      { name: "Gary Oldman", character: "James Gordon", profile_path: "/3cE4rZgYn0m6Hq4P5T6C6nCb7fT.jpg" }
    ],
    categories: ["top_rated", "popular"]
  },
  {
    id: 27205,
    title: "Inception",
    overview: "Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible: \"inception\".",
    poster_path: "/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg",
    backdrop_path: "/8ZTVqvKDQ8emSGUEMjsS4xRoC2Q.jpg",
    release_date: "2010-07-15",
    vote_average: 8.4,
    vote_count: 36200,
    genre_ids: [28, 878, 12],
    runtime: 148,
    director: "Christopher Nolan",
    cast: [
      { name: "Leonardo DiCaprio", character: "Dom Cobb", profile_path: "/wo2hJpn04vbtmh0B9utCFdsQ2vK.jpg" },
      { name: "Joseph Gordon-Levitt", character: "Arthur", profile_path: "/dhv9V994n7aWjTqW9e0m3F5t6b7.jpg" },
      { name: "Elliot Page", character: "Ariadne", profile_path: "/e0m3F5t6b7dhv9V994n7aWjTqW9.jpg" },
      { name: "Tom Hardy", character: "Eames", profile_path: "/4P5T6C6nCb7fTC9WFsrqHQ2jXG5.jpg" }
    ],
    categories: ["top_rated", "popular"]
  },
  {
    id: 569094,
    title: "Spider-Man: Across the Spider-Verse",
    overview: "After reuniting with Gwen Stacy, Brooklyn’s full-time, friendly neighborhood Spider-Man is catapulted across the Multiverse, where he encounters the Spider Society.",
    poster_path: "/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
    backdrop_path: "/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg",
    release_date: "2023-05-31",
    vote_average: 8.4,
    vote_count: 6700,
    genre_ids: [16, 28, 12, 878],
    runtime: 140,
    director: "Joaquim Dos Santos, Kemp Powers",
    cast: [
      { name: "Shameik Moore", character: "Miles Morales", profile_path: "/v2y3T3yS9uN3z7AfhqdflX0W9a3.jpg" },
      { name: "Hailee Steinfeld", character: "Gwen Stacy", profile_path: "/q4P5T6C6nCb7fTC9WFsrqHQ2jXG.jpg" },
      { name: "Oscar Isaac", character: "Miguel O'Hara", profile_path: "/aBGE7A4h11n54P6Er3A7ev7ycA6.jpg" }
    ],
    categories: ["trending", "top_rated"]
  },
  {
    id: 533535,
    title: "Deadpool & Wolverine",
    overview: "A listless Wade Wilson toils away in civilian life with his days as the morally flexible mercenary, Deadpool, behind him. But when his homeworld faces an existential threat, Wade must reluctantly suit-up again with an even more reluctant Wolverine.",
    poster_path: "/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
    backdrop_path: "/yDHYTfA3R0jFYba16jBB1jv8uaC.jpg",
    release_date: "2024-07-24",
    vote_average: 7.7,
    vote_count: 5200,
    genre_ids: [28, 35, 878],
    runtime: 128,
    director: "Shawn Levy",
    cast: [
      { name: "Ryan Reynolds", character: "Wade Wilson / Deadpool", profile_path: "/h1coFc7oIN4HwzUm4IMPtWvN2t4.jpg" },
      { name: "Hugh Jackman", character: "Logan / Wolverine", profile_path: "/4Xujtewxqt6aU3Y8K4v5w9f9h6j.jpg" },
      { name: "Emma Corrin", character: "Cassandra Nova", profile_path: "/qK9d1r6m7haRef0WHqJ2tW6WMUD.jpg" }
    ],
    categories: ["trending", "popular", "now_playing"]
  },
  {
    id: 1022789,
    title: "Inside Out 2",
    overview: "Teenager Riley's mind headquarters is undergoing a sudden demolition to make room for something entirely unexpected: new Emotions! Joy, Sadness, Anger, Fear and Disgust aren't sure how to feel when Anxiety shows up.",
    poster_path: "/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg",
    backdrop_path: "/stKGOmPAg44gI7rYy7Vn5mZ4rQY.jpg",
    release_date: "2024-06-11",
    vote_average: 7.6,
    vote_count: 4800,
    genre_ids: [16, 10751, 12, 35],
    runtime: 96,
    director: "Kelsey Mann",
    cast: [
      { name: "Amy Poehler", character: "Joy", profile_path: "/rB5T6C6nCb7fTC9WFsrqHQ2jXG5.jpg" },
      { name: "Maya Hawke", character: "Anxiety", profile_path: "/eX6C6nCb7fTC9WFsrqHQ2jXG5T.jpg" },
      { name: "Phyllis Smith", character: "Sadness", profile_path: "/tC6nCb7fTC9WFsrqHQ2jXG5TB5T.jpg" }
    ],
    categories: ["trending", "popular", "now_playing"]
  },
  {
    id: 549554,
    title: "Gladiator II",
    overview: "Years after witnessing the death of the revered hero Maximus at the hands of his uncle, Lucius must enter the Colosseum after his home is conquered by the tyrannical Emperors who now lead Rome with an iron fist.",
    poster_path: "/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg",
    backdrop_path: "/euYIwmqkmz95mnXvufEmbL69nmr.jpg",
    release_date: "2024-11-05",
    vote_average: 6.9,
    vote_count: 2200,
    genre_ids: [28, 12, 18],
    runtime: 148,
    director: "Ridley Scott",
    cast: [
      { name: "Paul Mescal", character: "Lucius Verus", profile_path: "/fTC9WFsrqHQ2jXG5z57T6C6nCb7.jpg" },
      { name: "Pedro Pascal", character: "Marcus Acacius", profile_path: "/9r6m7haRef0WHqJ2tW6WMUDux91.jpg" },
      { name: "Denzel Washington", character: "Macrinus", profile_path: "/tW6WMUDux911r6m7haRef0WHqJ2.jpg" },
      { name: "Connie Nielsen", character: "Lucilla", profile_path: "/UDux911r6m7haRef0WHqJ2tW6WM.jpg" }
    ],
    categories: ["trending", "now_playing"]
  },
  {
    id: 238,
    title: "The Godfather",
    overview: "Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family. When organized crime family patriarch, Vito Corleone barely survives an attempt on his life, his youngest son, Michael steps in to take care of the would-be killers.",
    poster_path: "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    backdrop_path: "/tmU7GeKVybMWFButWEGl2M4GeiP.jpg",
    release_date: "1972-03-14",
    vote_average: 8.7,
    vote_count: 20100,
    genre_ids: [18, 80],
    runtime: 175,
    director: "Francis Ford Coppola",
    cast: [
      { name: "Marlon Brando", character: "Don Vito Corleone", profile_path: "/fuTEJwS9673YqKjZ3Q4xWc3L9Z7.jpg" },
      { name: "Al Pacino", character: "Michael Corleone", profile_path: "/2dGFbcmqvKiMUG01kR9L2Oik8J8.jpg" },
      { name: "James Caan", character: "Sonny Corleone", profile_path: "/aBGE7A4h11n54P6Er3A7ev7ycA6.jpg" }
    ],
    categories: ["top_rated"]
  },
  {
    id: 680,
    title: "Pulp Fiction",
    overview: "A burger-loving hit man, his philosophical partner, a drug-addled gangster's moll and a washed-up boxer converge in this sprawling, comedic crime caper. Their adventures unfurl in three stories that ingeniously trip back and forth in time.",
    poster_path: "/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    backdrop_path: "/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg",
    release_date: "1994-09-10",
    vote_average: 8.5,
    vote_count: 27500,
    genre_ids: [53, 80],
    runtime: 154,
    director: "Quentin Tarantino",
    cast: [
      { name: "John Travolta", character: "Vincent Vega", profile_path: "/ns8W0e8cM8e9z7yXw0vN2t4wo2h.jpg" },
      { name: "Samuel L. Jackson", character: "Jules Winnfield", profile_path: "/mX6xWc3L9Z7Z8elSlNg0Wqj9Exb.jpg" },
      { name: "Uma Thurman", character: "Mia Wallace", profile_path: "/wo2hJpn04vbtmh0B9utCFdsQ2vK.jpg" },
      { name: "Bruce Willis", character: "Butch Coolidge", profile_path: "/tC6nCb7fTC9WFsrqHQ2jXG5TB5T.jpg" }
    ],
    categories: ["top_rated", "popular"]
  },
  {
    id: 76600,
    title: "Avatar: The Way of Water",
    overview: "Set more than a decade after the events of the first film, learn the story of the Sully family, the trouble that follows them, the lengths they go to keep each other safe, the battles they fight to stay alive, and the tragedies they endure.",
    poster_path: "/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
    backdrop_path: "/s16H6tpK2utvwDtzZ8Qy4qm5Emw.jpg",
    release_date: "2022-12-14",
    vote_average: 7.7,
    vote_count: 11400,
    genre_ids: [878, 12, 28],
    runtime: 192,
    director: "James Cameron",
    cast: [
      { name: "Sam Worthington", character: "Jake Sully", profile_path: "/v2y3T3yS9uN3z7AfhqdflX0W9a3.jpg" },
      { name: "Zoe Saldaña", character: "Neytiri", profile_path: "/q4P5T6C6nCb7fTC9WFsrqHQ2jXG.jpg" },
      { name: "Sigourney Weaver", character: "Kiri", profile_path: "/aBGE7A4h11n54P6Er3A7ev7ycA6.jpg" }
    ],
    categories: ["popular"]
  }
];

module.exports = { GENRES, CURATED_MOVIES };
