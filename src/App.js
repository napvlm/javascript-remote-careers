import {useState, useEffect, useRef, createRef} from 'react';
import Posts from './components/Posts';
import './App.css';

// @TODO:
// 1. Fetch different APIs and put result into one array/object: DONE
// 2. Mix all together randomly: DONE
// 3. Enable search by adding/removing tags via button chips React, Angular, Vue, Node.js => Use Algolia for this
// 4. Load only first 15 and make infinite scroll DONE
// 5. Add counter of how much jobs is displayed: DONE
// 6. Add 'days ago' to post

let arrayForHoldingPosts = [];

function App() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [postsToShow, setPostsToShow] = useState([]);
  const [searchValue, setSearchValue] = useState('javascript')
  const postsPerPage = 15;

  const shuffle = (array) => {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }

  const loadJobs = () => {
    const dataSources = [
      `https://remoteok.com/api?tags=${searchValue}`,
      `https://remotive.io/api/remote-jobs?search=${searchValue}`,
    ];
    
    Promise.all(
      Object.entries(dataSources).map(([propertyName, url]) => (
        fetch(url).then(res => res.json())
      )),
      setLoading(true)
    ).then((result) => {
      result[0].shift()
      const fullList = result[1].jobs.concat(result[0])
      shuffle(fullList)
      setPosts(fullList)
      setIsLoaded(true)
      setLoading(false)
      loopWithSlice(0, postsPerPage, fullList)
    })
    .catch((error) => {
      setIsLoaded(true);
      setError(error);
    })
  }

  const loopWithSlice = (start, end, posts) => {
    const slicedPosts = posts.slice(start, end);
    arrayForHoldingPosts = [...arrayForHoldingPosts, ...slicedPosts];
    setPostsToShow(arrayForHoldingPosts);
  };

  useEffect(() => {
    loadJobs()

    window.onscroll = function() {
      if ((window.innerHeight + Math.ceil(window.pageYOffset)) >= document.body.offsetHeight) {
        loadJobs()
      }
    }
  }, [])

  const handleCheckbox = (e) => {
    setSearchValue(e.target.value)
    loadJobs()
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading some JS jobs for you...</div>;
  } else {

    return (
      <>
        Total jobs found {posts.length}
        <div className="form-check">
          <input className="form-check-input" type='checkbox' id="react" value='react' onClick={handleCheckbox} />
          <label className="form-check-label" htmlFor="react">
            React
          </label>
        </div>
        <div className="form-check">
          <input className="form-check-input" type='checkbox' id="vue" value='vue' onClick={handleCheckbox} />
          <label className="form-check-label" htmlFor="vue">
            Vue
          </label>
        </div>
        <div className="form-check">
          <input className="form-check-input" type='checkbox' id="angular" value='angular' onClick={handleCheckbox} />
          <label className="form-check-label" htmlFor="angular">
            Angular
          </label>
        </div>

        <div className='count'>
          Post displayed: {postsToShow.length}
          <button onClick={loadJobs}>Load more</button>
        </div>
        <Posts posts={postsToShow} />
        {loading ?
          <div className="d-flex justify-content-center mt-4">
            <div className="spinner-border" role="status">
            </div>
          </div>
         : 
          null
        }
      </>
    )
  }
}

export default App;
