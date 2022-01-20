import {useState, useEffect} from "react";

// @TODO:
// 1. Fetch different APIs and put result into one array/object
// 2. Mix all together randomly
// 3. Enable search by adding/removing tags via button chips React, Angular, Vue, Node.js
// 4. Load only first 15 and make lazy load as user scroll or pagination (probably pagination) 

function App() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const jobsArray = []

  function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }

  useEffect(() => {
    const dataSources = [
        "https://remoteok.com/api?tags=javascript",
        "https://remotive.io/api/remote-jobs?search=javascript",
    ];
    
    Promise.all(
      Object.entries(dataSources).map(([propertyName, url]) => (
          fetch(url).then(res => res.json())
      ))
    ).then((result) => {
      result[0].shift()
      const fullList = result[1].jobs.concat(result[0])
      shuffle(fullList);
      setItems(fullList)
      setIsLoaded(true)
    })
    .catch((error) => {
      setIsLoaded(true);
      setError(error);
    })
  }, [])

  

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    console.log(items)
    return (
        items.map((item, idx) => (
          item.hasOwnProperty('apply_url') ? 

            <div className="card mb-3" key={idx}>
              <div className="card-body">
                <img className="img-fluid" src={item.company_logo} alt={item.company} width="50"/>
                <p className="large">
                  <b>{item.position}</b>
                </p>
                <p>{item.location}</p>
                <a className="btn btn-light" href="#">Read more</a>
                <a className="btn btn-primary" href={item.apply_url} target="_blank" rel="noreferrer">Apply</a>
              </div>
            </div>

          :

            <div className="card mb-3" key={idx}>
              <div className="card-body">
                <img className="img-fluid" src='https://icon-library.com/images/company-icon/company-icon-2.jpg' alt={item.company_name} width="50"/>
                <p className="large">
                  <b>{item.title}</b>
                </p>
                <p>{item.candidate_required_location}</p>
                <a className="btn btn-light" href="#">Read more</a>
                <a className="btn btn-primary" href={item.url} target="_blank" rel="noreferrer">Apply</a>
              </div>
            </div>

        ))
    );
  }
}

export default App;
