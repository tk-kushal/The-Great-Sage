import { db } from './firebase.js'
import {
  collection,
  doc,
  getDoc,
  setDoc,
  getDocs,
} from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js'

async function createSkill(skillName, prereqSkills=[], description) {
  await setDoc(doc(db, 'masterskills', skillName + ''), {
    id: skillName,
    prerequisites: prereqSkills,
    description: description,
  })
}



async function createSkillManual() {
  await setDoc(doc(db, 'masterskills', "HTML"), {
    id: "HTML",
    prerequisites: []
    // description: "It is a programming language that is one of the core technologies of the World Wide Web, alongside HTML and CSS.",
  })
}

//createSkillManual()

const querySnapshot = await getDocs(collection(db, 'masterskills'))
querySnapshot.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
  console.log(doc.id, ' => ', doc.data())
})

const form = document.querySelector('form');
const morePrereq = document.getElementById('morePrereq');
const lessPrereq = document.getElementById('lessPrereq');
const prereqArray = document.getElementById('prereqArray');
let  dom = ""

morePrereq.addEventListener('click', (e) =>{
  dom += `<input type="text" id="prereq-skills" name="prereq-skills[]"><br>`
  prereqArray.innerHTML = dom
  e.preventDefault();
})

lessPrereq.addEventListener('click', (e) =>{
  // if(dom!==`<input type="text" id="prereq-skills" name="prereq-skills[]"><br>`){
  //   dom =
  // }
  dom = `<input type="text" id="prereq-skills" name="prereq-skills[]"><br>`
  prereqArray.innerHTML = dom
  e.preventDefault();
})

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const skillName = document.querySelector('#skill-name').value;
  const prereqSkills = Array.from(document.querySelectorAll('[name="prereq-skills[]"]')).map(input => input.value.trim()).filter(input => input !== '');
  // const description = document.querySelector('#description').value;
  let currentDescription = ""

  createSkill(skillName, prereqSkills, currentDescription);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.clear()
    console.log("Submit Successful");
  });
});

export { collection, doc, getDoc, setDoc, getDocs, db }
