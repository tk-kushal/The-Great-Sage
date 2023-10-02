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
  const description = document.querySelector('#description').value;

  createSkill(skillName, prereqSkills, description);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
  });
});