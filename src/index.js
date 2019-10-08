import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, withRouter } from 'react-router-dom';
import * as Redux from 'redux';
import * as ReactRedux from 'react-redux';
import './index.css';
import AuthorQuiz from './AuthorQuiz';
import AddAuthorForm from './AddAuthorForm';
import * as serviceWorker from './serviceWorker';
import {shuffle, sample} from 'underscore'

const authors = [
    {
        name: 'Mark Twain',
        imageUrl: 'images/authors/marktwain.jpg',
        imageSource: 'Wikimedia Commons',
        books: ['The Adventures of Huckleberry Finn', 'Heart of Darkness']
      },
      {
        name: 'Joseph Conrad',
        imageUrl: 'images/authors/josephconrad.png',
        imageSource: 'Wikimedia Commons',
        books: ['Heart of Darkness']
      },
      {
        name: 'J.K. Rowling',
        imageUrl: 'images/authors/jkrowling.jpg',
        imageSource: 'Wikimedia Commons',
        imageAttribution: 'Daniel Ogren',
        books: ['Harry Potter and the Sorcerers Stone']
      },
      {
        name: 'Stephen King',
        imageUrl: 'images/authors/stephenking.jpg',
        imageSource: 'Wikimedia Commons',
        imageAttribution: 'Pinguino',
        books: ['The Shining', 'IT']
      },
      {
        name: 'Charles Dickens',
        imageUrl: 'images/authors/charlesdickens.jpg',
        imageSource: 'Wikimedia Commons',
        books: ['David Copperfield', 'A Tale of Two Cities']
      },
      {
        name: 'William Shakespeare',
        imageUrl: 'images/authors/williamshakespeare.jpg',
        imageSource: 'Wikimedia Commons',
        books: ['Hamlet', 'Macbeth', 'Romeo and Juliet']
      }
]

function getTurnData(data){
    const allBooks  = data.reduce(function(coll, curr, index){
        return coll.concat(curr.books);
    }, []);
    const fourRandomBooks = shuffle(allBooks).slice(0,4); 
    const answer = sample(fourRandomBooks);     
    return {
        books: fourRandomBooks,
        author: data.find((au) => au.books.some((title) => title === answer))
    }
}


function reducer(state = {authors, turnData: getTurnData(authors), highlight:''}, action){
  console.log("Reducer");
  console.log(action);
  switch(action.type){
    case 'ANSWER_SELECTED':
      const isCorrect = state.turnData.author.books.some((book) => book === action.answer);
      return Object.assign({}, state, { highlight: isCorrect ? 'correct' : 'wrong'});
    case 'CONTINUE':      
      return Object.assign({}, state, { turnData: getTurnData(state.authors), highlight: ''});
    case 'ADD_AUTHOR':
      return Object.assign({}, state, {
        authors: state.authors.concat([action.author])
      });
    default: 
      return state;
  }
}

let store = Redux.createStore(
  reducer, 
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() //Option for redux chrome extension
);

ReactDOM.render(
<BrowserRouter>
  <ReactRedux.Provider store={store}>  
    <React.Fragment>
      <Route exact path="/" component={AuthorQuiz} />
      <Route path="/add" component={AddAuthorForm} />
    </React.Fragment>
  </ReactRedux.Provider>
</BrowserRouter> , document.getElementById('root')); 

 
serviceWorker.unregister();
