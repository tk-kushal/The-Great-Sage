import { auth, onAuthStateChanged, signIn } from './Firebase/auth.js'
import { db } from './Firebase/firebase.js'
import {
  collection,
  doc,
  getDoc,
  setDoc,
  getDocs,
} from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js'

const signInButton = document.getElementById('signinBtn')
const signinSection = document.getElementsByClassName('signin')[0]
const profileImage = document.getElementById('profileImage')
const userName = document.getElementById('userName')
const worldGraphBtn = document.getElementsByClassName('worldGraphBtn')[0]
const userGraphBtn = document.getElementsByClassName('userGraphBtn')[0]
const toggleBackdrop = document.getElementsByClassName('toggleBackdrop')[0]
const logOutBtn = document.getElementsByClassName('logout')[0]
const SignedIn = document.getElementsByClassName('signedIn')[0]
const skills = document.getElementsByClassName('skills')[0]
const addSkillSectionBtn = document.getElementsByClassName('addNewSkill')[0]
const addSkillSection = document.getElementsByClassName('addSkillSection')[0]

let fetchedData = { skills: [] }
let data, userSkills
let link, node, label
let currentUser = null
let currentGraphMode = 'world'
// Create the canvas
let svg = d3.select('svg'),
  width = +svg.node().getBoundingClientRect().width,
  height = +svg.node().getBoundingClientRect().height

onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user
    profileImage.src = user.photoURL
    userName.innerText = user.displayName
    userGraphBtn.style.display = 'flex'
    currentGraphMode = 'user'
    SignedIn.style.display = 'flex'
    signinSection.style.display = 'none'
    fetchUserData()
    changeGraphMode()
  } else {
    SignedIn.style.display = 'none'
    signinSection.style.display = 'flex'
    currentGraphMode = 'world'
    changeGraphMode()
    console.log('User not Logged In !')
  }
})
function changeGraphMode() {
  if (data) {
    setupSimulation()
  }
  if (currentGraphMode == 'user') {
    userGraphBtn.classList.add('bold')
    worldGraphBtn.classList.remove('bold')
    toggleBackdrop.classList.add('toggleBackdropOn')
    currentGraphMode = 'user'
  } else {
    userGraphBtn.classList.remove('bold')
    worldGraphBtn.classList.add('bold')
    toggleBackdrop.classList.remove('toggleBackdropOn')
    currentGraphMode = 'world'
  }
}
userGraphBtn.addEventListener('click', () => {
  currentGraphMode = 'user'
  changeGraphMode()
})
worldGraphBtn.addEventListener('click', () => {
  currentGraphMode = 'world'
  changeGraphMode()
})
logOutBtn.addEventListener('click', () => {
  auth.signOut()
})
signInButton.addEventListener('click', () => {
  signIn()
})
addSkillSectionBtn.addEventListener('click', () => {
  if (addSkillSection.classList.contains('addSkillShow')) {
    addSkillSection.classList.remove('addSkillShow')
  } else {
    addSkillSection.classList.add('addSkillShow')
  }
})

getDocs(collection(db, 'masterskills')).then((querySnapshot) => {
  querySnapshot.forEach((doc) => {
    fetchedData.skills.push(doc.data())
  })
  data = fetchedData
  fetchUserData()
})

function fetchUserData() {
  if (currentUser) {
    getDoc(doc(db, 'users', currentUser.uid + '')).then((querySnapshot) => {
      userSkills = querySnapshot.data().skills
      console.log(userSkills)
      renderUserSKills()
      setupSimulation()
    })
  } else {
    setupSimulation()
  }
}
async function addSkillToUser(skillName, level, uid) {
  userSKills.push({ id: skillName, level: level })
  await setDoc(doc(db, 'users', uid + ''), {
    skills: userSKills,
  })
}
function renderUserSKills() {
  skills.innerHTML = ''
  console.log(userSkills)
  userSkills.forEach((data) => {
    let skill = document.createElement('div')
    skill.className = 'skillInfo'
    skill.id = data.id
    skill.innerHTML = `
      <div class="skillname" >${data.id}</div>
      <div class="level" style="color: ${skillLevelColor(data.level)};">
        <i class="fa-solid fa-star"></i>
      </div>
    `
    skill.addEventListener('mouseover', () => nodeHover(searchSkill(data.id)))
    skill.addEventListener('mouseout', () => nodeUnhover(searchSkill(data.id)))
    skills.appendChild(skill)
  })
}
function skillLevelColor(level) {
  return level == 0
    ? '#CD7F32'
    : level == 1
    ? '#808080'
    : level == 2
    ? 'gold'
    : 'white'
}
// Set up the force simulation
function setupSimulation() {
  svg.selectAll('*').remove()
  generateLinks()
  calculateWeight()

  let simulation = d3
    .forceSimulation()
    .force(
      'link',
      d3
        .forceLink()
        .distance(50)
        .id((d) => d.id),
    )
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force(
      'charge',
      d3.forceManyBody().strength(-100).distanceMin(10).distanceMax(200),
    )
    .force(
      'collision',
      d3.forceCollide().radius((d) => Math.sqrt(2) * 10),
    )
  // .force('radial',d3.forceRadial(130,width/2,height/2).strength(0.2))

  addEventListener('resize', (event) => {
    width = +svg.node().getBoundingClientRect().width
    height = +svg.node().getBoundingClientRect().height
    simulation.force('center', d3.forceCenter(width / 2, height / 2)).restart()
  })

  // Define the colors for the skills and links
  const color = d3.scaleOrdinal(d3.schemeCategory10)

  // Set up the node radius scale
  const radius = d3
    .scaleLinear()
    .domain(d3.extent(data.skills, (d) => 0.5))
    .range([5, 30])
  // Create the links
  link = svg
    .append('g')
    .attr('class', 'links')
    .selectAll('line')
    .data(data.links)
    .enter()
    .append('line')
    .attr('stroke-width', (d) => radiusValue(d))
    .attr('stroke', 'white')
    .attr('stroke-opacity', 1)
    .attr('class', 'link')
    .style('opacity', (d) => calculateOpacity(d))

  // Create the skills
  node = svg
    .append('g')
    .attr('class', 'skills')
    .selectAll('circle')
    .data(data.skills)
    .enter()
    .append('circle')
    .attr('r', (d) => `${Math.sqrt(d.weight * 3) + 5 || 10}px`)
    .attr('fill', 'black')
    .call(drag(simulation))
    .on('click', (d) => showLabel(d))
    .on('mouseover', (d) => nodeHover(d))
    .on('mouseout', (d) => nodeUnhover(d))
    .attr('stroke', 'white')
    .attr('stroke-width', (d) => `${Math.cbrt(d.weight) || 10}px`)
    .style('opacity', (d) => calculateOpacity(d))

  // Add labels to the skills
  label = svg
    .append('g')
    .attr('class', 'label')
    .selectAll('text')
    .data(data.skills)
    .enter()
    .append('text')
    .attr('dy', `3em`)
    .attr('font-size', '12px')
    .style('font-weight', '100')
    .style('opacity', '0.3')
    .text((d) => d.id)

  node.append('title').text((d) => d.id)

  label.attr('dx', function (d) {
    const radiusValue = radius(d.count)
    return radiusValue ? radiusValue + 5 : 0
  })
  // Start the simulation
  simulation.nodes(data.skills).on('tick', ticked)
  simulation.force('link').links(data.links)
}
// Dragging functions
function drag(simulation) {
  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart()
    d.fx = d.x
    d.fy = d.y
  }

  function dragged(d) {
    d.fx = d3.event.x
    d.fy = d3.event.y
  }

  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0)
    d.fx = null
    d.fy = null
  }

  return d3
    .drag()
    .on('start', dragstarted)
    .on('drag', dragged)
    .on('end', dragended)
}

// Tick function
function ticked() {
  link
    .attr('x1', (d) => d.source.x)
    .attr('y1', (d) => d.source.y)
    .attr('x2', (d) => d.target.x)
    .attr('y2', (d) => d.target.y)

  node.attr('cx', (d) => d.x).attr('cy', (d) => d.y)

  label.attr('x', (d) => d.x).attr('y', (d) => d.y)
}

function nodeSelect(d) {}

function nodeHover(d) {
  label
    .filter((n) => n === d)
    .transition()
    .style('opacity', '1')
    .style('font-weight', '500')
  link
    .filter((n) => n.source === d)
    .attr('stroke', '#a0e4ff')
    .transition('0.1s ease')
    .style('filter', 'drop-shadow(0 0 15px #a0e4ff)')

  node
    .filter((n) => n == d)
    .transition()
    .duration(100)
    .attr('r', (d) => `${(Math.sqrt(d.weight * 3) + 5) * 1.3 || 10}px`)
    .attr('fill', '#a0e4ff')
}

function nodeUnhover(d) {
  label
    .filter((n) => n === d)
    .transition()
    .style('opacity', '0.5')
    .style('font-weight', '100')

  link
    .filter((n) => {
      return n.source === d
    })
    .attr('stroke', 'white')
    .transition('0.1s ease')
    .style('filter', 'drop-shadow(0 0 15px white)')
  node
    .filter((n) => n == d)
    .transition()
    .duration(100)
    .attr('r', (d) => `${Math.sqrt(d.weight * 3) + 5 || 10}px`)
    .attr('fill', 'black')
}

function radiusValue(d) {
  let weight = 1
  let source = 1
  let target = 1
  data.skills.forEach((node) => {
    if (d.source == node.id) {
      source = node.weight
    }
  })
  data.skills.forEach((node) => {
    if (d.target == node.id) {
      target = node.weight
    }
  })
  weight = Math.sqrt(Math.cbrt(source * target))
  return weight
}
function calculateWeight() {
  for (let i = 1; i <= 100; i++) {
    data.skills.forEach((skill) => {
      let skillweight = 1
      data.links.forEach((link) => {
        if (skill.id == link.source) {
          skillweight += searchSkill(link.target).weight
        }
      })
      skill.weight = skillweight
    })
  }
}
function generateLinks() {
  let generatedLinks = []
  data.skills.forEach((skill) => {
    skill.prerequisites.forEach((prerequisite) => {
      generatedLinks.push({ source: prerequisite, target: skill.id })
    })
  })
  data.links = generatedLinks
}
function searchSkill(id) {
  let foundSkill = null
  data.skills.forEach((skill) => {
    if (skill.id == id) {
      foundSkill = skill
    }
  })
  return foundSkill
}
function calculateOpacity(d) {
  let opacity = 0.5
  if (currentGraphMode == 'world') {
    opacity = 1
  }
  if (currentUser) {
    userSkills.forEach((skill) => {
      if (skill.id == d.id) {
        opacity = 1
      }
      if (skill.id == d.source) {
        opacity = 1
      }
    })
  }
  return opacity
}
