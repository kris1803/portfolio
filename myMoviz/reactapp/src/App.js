//import logo from './logo.svg';
import './App.css';
import Movie from './components/Movie';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Nav, NavItem, Button, NavLink, UncontrolledPopover, PopoverBody, PopoverHeader, ListGroup, ListGroupItem } from 'reactstrap';
import { useEffect, useState } from 'react';


let movies = [
  {
    name: 'Star Wars : L\'ascension de Skywalker',
    desc: 'Lorem Ipsum',
    img: './img/starwars.jpg',
    note: 9.2,
    vote: 4
  },
  {
    name: 'Maléfique: Le retour',
    desc: 'Lorem Ipsum  Lorem Ipsum',
    img: './img/maleficent.jpg',
    note: 6.2,
    vote: 6
  },
  {
    name: 'Jumanji: Le retour',
    desc: 'Lorem Ipsum',
    img: './img/jumanji.jpg',
    note: 5.5,
    vote: 7
  },
  {
    name: 'Once Upon a Time in Hollywood',
    desc: 'Lorem Ipsum',
    img: './img/once_upon.jpg',
    note: 7.5,
    vote: 6
  },
  {
    name: 'Reine des neiges 4',
    desc: 'Lorem Ipsum',
    img: './img/frozen.jpg',
    note: 7,
    vote: 4
  },
  {
    name: 'Terminator: le retour des cyborgs',
    desc: 'Lorem Ipsum',
    img: './img/terminator.jpg',
    note: 6.5,
    vote: 5
  }
];

function App() {

  const [moviesCount, setMoviesCount] = useState(0);
  const [moviesWishList, setMoviesWishList] = useState([]);
  const [moviesList, setMoviesList] = useState([]);

  useEffect(() => {
    async function askMovies() {
      // fetch to /new-movies route
      const rawData = await fetch("/new-movies")
      let data = await rawData.json();
      let formattedData = data.results.map((movie) => {
        return {
          name: movie.title,
          desc: movie.overview.substr(0, 80) + '...',
          img: 'https://image.tmdb.org/t/p/w500' + movie.backdrop_path,
          note: movie.vote_average,
          vote: movie.vote_count
        }
      });
      setMoviesList(formattedData)
    }
    askMovies();
    async function askWishlist() {
      // fetch to /wishlist-movie route
      const rawData = await fetch("/wishlist-movie")
      let data = await rawData.json();
      setMoviesWishList(data)
      setMoviesCount(data.length);
    }
    askWishlist();
  }, []);

  let handleClickDeleteMovie = (movieName) => {
    async function sendMovie(movieName) {
      let rawdata = await fetch('/wishlist-movie/'+movieName, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: ''
      });
      let data = await rawdata.json();
      console.log(data);
    }
    sendMovie(movieName);
    setMoviesCount(moviesCount - 1);
    setMoviesWishList(moviesWishList.filter(movie => movie.movieName !== movieName));
  };

  let handleClickAddMovie = (movieName, movieImg) => {
    setMoviesCount(moviesCount + 1);
    let wishMovie = {
      movieName: movieName,
      movieImg: movieImg
    };
    // envoyer au backend ici
    async function addMovie(movieName, movieImg) {
      let rawdata = await fetch('/wishlist-movie', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'movieName='+movieName+'&movieImg='+movieImg
      });
      let data = await rawdata.json();
      console.log(data);
    }
    addMovie(movieName, movieImg);
    setMoviesWishList([...moviesWishList, wishMovie]);
  }

  let myMovies = [];
  for (let i = 0; i < moviesList.length; i++) {
    let toSee = false;
    for (let j = 0; j < moviesWishList.length; j++) {
      if (moviesList[i].name === moviesWishList[j].movieName) {
        toSee = true;
      }
    }
    myMovies.push(<Movie handleClickParent={handleClickAddMovie} toSee={toSee} handleClickDeleteMovieParent={handleClickDeleteMovie} movieName={moviesList[i].name} movieDesc={moviesList[i].desc} movieImg={moviesList[i].img} globalRating={moviesList[i].note} globalCountRating={moviesList[i].vote} key={i} />);
  }

  let movieClick = (movieName) => {
    // enlever le film de la wishlist
    handleClickDeleteMovie(movieName);
    // refaire à nouveau le tableau myMovies avec le film enlevé
    myMovies = [];
    for (let i = 0; i < movies.length; i++) {
      let toSee = false;
      for (let j = 0; j < moviesWishList.length; j++) {
        if (movies[i].name === moviesWishList[j].movieName) {
          toSee = true;
        }
      }
      myMovies.push(<Movie handleClickParent={handleClickAddMovie} toSee={toSee} handleClickDeleteMovieParent={handleClickDeleteMovie} movieName={movies[i].name} movieDesc={movies[i].desc} movieImg={movies[i].img} globalRating={movies[i].note} globalCountRating={movies[i].vote} />);
    }
  }

  let myWishList = moviesWishList.map((movie, index) => {
    return <ListGroupItem key={index} onClick={() => movieClick(movie.movieName)} ><img width={'35px'} src={movie.movieImg} alt='movie' />{index + 1}: {movie.movieName}</ListGroupItem>
  });

  return (
    <Container fluid className='bg-dark min-vh-100'>
      <Container>
        <Row>
          <Col xs='12' className='mt-2 mb-4'>
            <Nav>
              <NavItem>
                <img src='./img/logo.png' alt='Logo' />
              </NavItem>
              <NavItem>
                <NavLink href='/' className='text-white'>
                  Last releases
                </NavLink>
              </NavItem>
              <NavItem>
                <Button type='button' color='secondary' id='popoverFilms'>
                  {moviesCount} films
                </Button>
                <UncontrolledPopover
                  placement="bottom"
                  target="popoverFilms"
                  trigger='focus'
                >
                  <PopoverHeader>
                    Ma wishlist
                  </PopoverHeader>
                  <PopoverBody>
                    <ListGroup>
                      {myWishList}
                    </ListGroup>
                  </PopoverBody>
                </UncontrolledPopover>
              </NavItem>
            </Nav>
          </Col>
        </Row>
        <Row xs='1' lg='2' xl='3' >
          {myMovies}
        </Row>

      </Container>
    </Container>
  );
}

export default App;
