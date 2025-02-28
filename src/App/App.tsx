/* eslint-disable prettier/prettier */
import * as React from "react";

import styles from "./App.module.scss";

interface Questions {
  category: string;
  correct_answer: string;
  difficulty: string;
  incorrect_answers: string[];
  question: string;
  type: string;
}

const App: React.FC = () => {
  
  const [questions, setQuestions] = React.useState<Questions[]>([]);
  const [actualQuestion, setActualQuestion] = React.useState<number>(0);
  const [answers, setAnswers] = React.useState<string[]>([]);
  const [totalScore, setTotalScore] = React.useState<number>(0);
  const [start, setStart] = React.useState<boolean>(false);
  const [showAnswer, setShowAnswer] = React.useState<boolean>(false);
  const [checking, setChecking] = React.useState(false);

  React.useEffect(() => {
  const getQuestion = async() => {
    //const preguntas = window.localStorage.getItem('preguntas');

    // if( preguntas ){
    //   setQuestions( JSON.parse(preguntas) )
    // }
    //else{
      const response = await fetch("https://opentdb.com/api.php?amount=10");
      const data = await response.json();
      const items = await data.results;
  
      setQuestions( items );
     // window.localStorage.setItem('preguntas', JSON.stringify(items));
    }
  //}
  
  getQuestion();
  },[setQuestions, setAnswers, setActualQuestion]);

  React.useEffect(() => {
      setAnswers( questions[actualQuestion]?.incorrect_answers.concat( questions[actualQuestion]?.correct_answer ) )
  }, [actualQuestion ])
  

  const checkAnswer = (answer:string) => {
    if( answer !== questions[actualQuestion].correct_answer) setShowAnswer(true);
    else setChecking(true);
    setTimeout(() => {
      if ( answer === questions[actualQuestion].correct_answer ){
        if( questions[actualQuestion].type === 'multiple' ) setTotalScore( prev => prev + 10);
        else setTotalScore( prev => prev + 5);
      }
      if( actualQuestion < 10 ){
        setActualQuestion( prev => prev + 1);      
      }
      setShowAnswer(false);
      setChecking(false);
    }, 3000);
    
  }

  const startGame = () => {
    setStart(true);
    if( questions ) setAnswers( questions[actualQuestion]?.incorrect_answers.concat( questions[actualQuestion]?.correct_answer ) )
  }
   
  return (
    <main className={styles.container}>
      {
        start ? '' : <button className={styles.score} onClick={ startGame }>Start Game</button>
      }
      {
        actualQuestion >= 10 ?
        (
          <>
            <h1 className={styles.finalScore}>Final Score: {totalScore}</h1>
            <button className={styles.finalScore} onClick={ () => setActualQuestion(0) }>Reset</button>
          </>
        )
        :
        (
          <section className={styles.questionContainer}>
            <div className={styles.questions}>
              <div className={styles.questionDetails}>
                <h4 className={styles.category}>Category: {questions[actualQuestion]?.category}</h4>
                <h4>Difficulty: {questions[actualQuestion]?.difficulty}</h4>
              </div>
              <div className={styles.questionText}>
                <h2>{questions[actualQuestion]?.question.replaceAll("&quot;",'"').replaceAll("&#039","'")}</h2> 
              </div>  
            </div>
            <div />

            <section className={styles.anwersContainer} >
              {
                answers?.map( ans => (              
                <button 
                    key={ans} 
                    className={`${styles.answer} ${ !(checking || showAnswer) && styles.answerHover}`}
                    disabled={ checking || showAnswer }
                    onClick = { () => checkAnswer(ans)}
                  >
                      <span
                        className={`${styles.answerText} ${ (showAnswer && ans == questions[actualQuestion].correct_answer ) ?  styles.showWrongAnswer : (checking && ans == questions[actualQuestion].correct_answer) && styles.showCorrectAnswer} `}
                      >
                          {ans}
                      </span>
                  </button>          
                ))
              }
            </section>
          </section>
        )
      }
      
    </main>
  );
};

export default App;
