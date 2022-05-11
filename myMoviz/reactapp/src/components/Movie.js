import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { Col, Button, Card, CardBody, CardTitle, CardText, CardImg, Badge, ButtonGroup } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faStar, faVideo } from '@fortawesome/free-solid-svg-icons';

export default function Movie(props) {

    let likeMovie = props.toSee;
    let likeColor = likeMovie ? { color : '#e74c3c' } : {color:'#999'};

    let handleLikes = (movieName, movieImg) => {
        if (likeMovie === false) {
            props.handleClickParent(movieName, movieImg);
            likeColor = { color : '#e74c3c' };
            likeMovie = (true);
        } else {
            likeColor = { color : '#999' };
            props.handleClickDeleteMovieParent(movieName, movieImg);
            likeMovie = (false);
        }
    };

    const [countWatchMovie, setCountWatchMovie] = useState(0);
    let handleWatch = () => {
        setCountWatchMovie(countWatchMovie + 1);
    };

    const [myRatingMovie, setMyRatingMovie] = useState(5);
    const [globalRating, setGlobalRating] = useState(props.globalRating);

    let handleNoteMinus = () => {
        if (myRatingMovie > 0) {
            setMyRatingMovie(myRatingMovie - 1);
            let people = props.globalCountRating+1;
            let oldRating = props.globalRating*props.globalCountRating;
            //console.log('oldRating is: '+oldRating)
            let newGlobalRating = (oldRating+myRatingMovie-1)/people;
            newGlobalRating = Math.round(newGlobalRating);
            setGlobalRating(newGlobalRating);
        }
    };
    let handleNotePlus = () => {
        if (myRatingMovie < 10) {
            setMyRatingMovie(myRatingMovie + 1);
            let people = props.globalCountRating+1;
            let oldRating = props.globalRating*props.globalCountRating;
            let newGlobalRating = (oldRating+myRatingMovie+1)/people;
            newGlobalRating = Math.round(newGlobalRating);
            setGlobalRating(newGlobalRating);
        }
    };
    let handleCustomNote = (star) => {
        setMyRatingMovie(star);
        let people = props.globalCountRating+1;
        let oldRating = props.globalRating*props.globalCountRating;
        let newGlobalRating = (oldRating+star)/people;
        newGlobalRating = Math.round(newGlobalRating);
        setGlobalRating(newGlobalRating);
    }

    let ratingStars = [];
    for (let i = 0; i < 10; i++) {
        if (i<myRatingMovie) {
            ratingStars.push(<FontAwesomeIcon onClick={() => handleCustomNote(i+1)} key={i} icon={faStar} style={{color:'#ff0'}} />);
        }   else {
            ratingStars.push(<FontAwesomeIcon onClick={() => handleCustomNote(i+1)} key={i} icon={faStar} style={{color:'#999'}} />);
        }
    }

    return (
        <Col>
            <Card className='my-2'>
                <CardImg
                    alt="Card image cap"
                    src={props.movieImg}
                    top
                    width="100%" />
                <CardBody>
                    <CardTitle tag="h5">
                        {props.movieName}
                    </CardTitle>
                    <CardText>
                        <div className='likeit'>Like <FontAwesomeIcon icon={faHeart} onClick={() => {handleLikes(props.movieName, props.movieImg);} } style={likeColor} /></div>
                        <div>Nombre de vues <FontAwesomeIcon icon={faVideo} onClick={() => handleWatch()} /> <Badge color="secondary">{countWatchMovie}</Badge>
                        </div>
                        <div>Mon avis {ratingStars}
                            <ButtonGroup>
                                <Button color='secondary' onClick={() => handleNoteMinus()}>-</Button>
                                <Button color='secondary' onClick={() => handleNotePlus()}>+</Button>
                            </ButtonGroup>
                        </div>
                        <div>Moyenne <FontAwesomeIcon icon={faStar} />
                            <FontAwesomeIcon icon={faStar} />
                            <FontAwesomeIcon icon={faStar} />
                            <FontAwesomeIcon icon={faStar} />
                            <FontAwesomeIcon icon={faStar} />
                            <FontAwesomeIcon icon={faStar} />
                            <FontAwesomeIcon icon={faStar} />
                            <FontAwesomeIcon icon={faStar} />
                            <FontAwesomeIcon icon={faStar} />
                            <FontAwesomeIcon icon={faStar} />({globalRating})</div>
                        <p>{props.movieDesc}</p>
                    </CardText>
                </CardBody>
            </Card>
        </Col>
    );
}