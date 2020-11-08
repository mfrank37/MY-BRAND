const allQuestions = document.querySelector('.questions-section .all-questions');

FIRESTORE.collection('questions').get().then( result => {
    const QUESTIONS = result.docs;
    QUESTIONS.forEach( QUESTION => {
        displayQuestion(QUESTION.data());
    });
});

function displayQuestion(QUESTION){
    // div.question
    let question = document.createElement('div');
    question.classList.add('question');
    //      |___ h4.qn-from-who + span.date
    let fromWho = document.createElement('h4');
    fromWho.classList.add('qn-from-who');
    fromWho.innerHTML = `${QUESTION.name} — <span class="email"> ${QUESTION.email} </span>`;
    question.appendChild(fromWho);
    //      |___ span.date
    let whenAsked = document.createElement('span');
    whenAsked.classList.add('date');
    let date = new Date(QUESTION.time.seconds * 1000);
    whenAsked.innerHTML = date.toDateString();
    question.appendChild(whenAsked);
    //       |___ p.qn
    let querry = document.createElement('p');
    querry.classList.add('qn');
    querry.innerText = QUESTION.question;
    question.appendChild(querry);

   allQuestions.appendChild(question);
}