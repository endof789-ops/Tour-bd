let teams =
  JSON.parse(localStorage.getItem("teams")) || [];

let matches =
  JSON.parse(localStorage.getItem("matches")) || [];



/* SAVE DATA */

function saveData() {

  localStorage.setItem(
    "teams",
    JSON.stringify(teams)
  );

  localStorage.setItem(
    "matches",
    JSON.stringify(matches)
  );

}



/* PAGE CHANGE */

function showPage(page) {

  document
    .querySelectorAll(".page")
    .forEach(p => {

      p.classList.add("hidden");

    });

  document
    .getElementById(page)
    .classList.remove("hidden");

  render();

}



/* ADD TEAM */

function addTeam() {

  const input =
    document.getElementById("teamName");

  const name =
    input.value.trim();

  if (!name) {

    alert("Team name লিখুন");

    return;

  }


  const team = {

    id: Date.now(),

    name: name

  };


  teams.push(team);

  input.value = "";

  saveData();

  render();

}



/* DELETE TEAM */

function deleteTeam(id) {

  const hasMatch =
    matches.some(
      m =>
        m.home === id ||
        m.away === id
    );

  if (hasMatch) {

    alert(
      "এই দলের ম্যাচ আছে। আগে ম্যাচের তথ্য ঠিক করুন।"
    );

    return;

  }


  teams =
    teams.filter(
      team =>
        team.id !== id
    );


  saveData();

  render();

}



/* CREATE MATCH */

function createMatch() {

  const home =
    Number(
      document.getElementById(
        "homeTeam"
      ).value
    );

  const away =
    Number(
      document.getElementById(
        "awayTeam"
      ).value
    );

  const date =
    document.getElementById(
      "matchDate"
    ).value;


  if (!home || !away) {

    alert(
      "দুইটি Team নির্বাচন করুন"
    );

    return;

  }


  if (home === away) {

    alert(
      "একই Team-এর সাথে ম্যাচ করা যাবে না"
    );

    return;

  }


  const match = {

    id: Date.now(),

    home: home,

    away: away,

    date: date,

    played: false,

    homeScore: null,

    awayScore: null

  };


  matches.push(match);

  saveData();

  render();

}



/* RESULT */

function addResult(id) {

  const match =
    matches.find(
      m => m.id === id
    );


  const homeScore =
    prompt(
      "Home Team-এর গোল:"
    );

  if (
    homeScore === null
  ) return;


  const awayScore =
    prompt(
      "Away Team-এর গোল:"
    );

  if (
    awayScore === null
  ) return;


  match.homeScore =
    Number(homeScore);

  match.awayScore =
    Number(awayScore);

  match.played = true;


  saveData();

  render();

}



/* DELETE MATCH */

function deleteMatch(id) {

  matches =
    matches.filter(
      m => m.id !== id
    );

  saveData();

  render();

}



/* FIND TEAM */

function getTeam(id) {

  return teams.find(
    t => t.id === id
  );

}



/* RENDER */

function render() {

  /* COUNTERS */

  document.getElementById(
    "teamCount"
  ).textContent =
    teams.length;


  document.getElementById(
    "matchCount"
  ).textContent =
    matches.length;


  document.getElementById(
    "playedCount"
  ).textContent =
    matches.filter(
      m => m.played
    ).length;



  /* TEAM LIST */

  const teamList =
    document.getElementById(
      "teamList"
    );


  teamList.innerHTML = "";


  teams.forEach(team => {

    teamList.innerHTML += `

      <div class="team">

        <strong>
          ${team.name}
        </strong>

        <button
          onclick="deleteTeam(${team.id})"
        >
          Delete
        </button>

      </div>

    `;

  });



  /* TEAM SELECT */

  const home =
    document.getElementById(
      "homeTeam"
    );

  const away =
    document.getElementById(
      "awayTeam"
    );


  home.innerHTML =
    `<option value="">
      Home Team
    </option>`;

  away.innerHTML =
    `<option value="">
      Away Team
    </option>`;


  teams.forEach(team => {

    home.innerHTML += `

      <option value="${team.id}">
        ${team.name}
      </option>

    `;


    away.innerHTML += `

      <option value="${team.id}">
        ${team.name}
      </option>

    `;

  });



  /* MATCH LIST */

  const matchList =
    document.getElementById(
      "matchList"
    );


  matchList.innerHTML = "";


  matches.forEach(match => {

    const homeTeam =
      getTeam(match.home);

    const awayTeam =
      getTeam(match.away);


    if (!homeTeam || !awayTeam)
      return;


    let score = "VS";

    if (match.played) {

      score =
        `${match.homeScore}
        -
        ${match.awayScore}`;

    }


    matchList.innerHTML += `

      <div class="match">

        <strong>
          ${homeTeam.name}
          &nbsp; ⚽ &nbsp;
          ${awayTeam.name}
        </strong>

        <div class="score">
          ${score}
        </div>

        <p>
          📅 ${match.date || "Date not set"}
        </p>


        ${
          match.played

          ?

          `<button
            onclick="addResult(${match.id})"
          >
            Edit Result
          </button>`

          :

          `<button
            onclick="addResult(${match.id})"
          >
            Add Result
          </button>`
        }


        <button
          onclick="deleteMatch(${match.id})"
          style="background:#dc2626"
        >
          Delete
        </button>

      </div>

    `;

  });



  renderTable();

}



/* POINTS TABLE */

function renderTable() {

  const table =
    document.getElementById(
      "pointsTable"
    );


  let data = {};


  teams.forEach(team => {

    data[team.id] = {

      name: team.name,

      played: 0,

      win: 0,

      draw: 0,

      loss: 0,

      gf: 0,

      ga: 0,

      points: 0

    };

  });



  matches
    .filter(m => m.played)
    .forEach(match => {

      const h =
        data[match.home];

      const a =
        data[match.away];


      if (!h || !a)
        return;


      h.played++;

      a.played++;


      h.gf +=
        match.homeScore;

      h.ga +=
        match.awayScore;


      a.gf +=
        match.awayScore;

      a.ga +=
        match.homeScore;



      if (
        match.homeScore >
        match.awayScore
      ) {

        h.win++;

        h.points += 3;

        a.loss++;

      }


      else if (
        match.homeScore <
        match.awayScore
      ) {

        a.win++;

        a.points += 3;

        h.loss++;

      }


      else {

        h.draw++;

        a.draw++;

        h.points++;

        a.points++;

      }

    });



  const rows =
    Object.values(data);


  rows.sort(
    (a, b) => {

      if (
        b.points !==
        a.points
      )

        return (
          b.points -
          a.points
        );


      const gdA =
        a.gf - a.ga;

      const gdB =
        b.gf - b.ga;


      return gdB - gdA;

    }
  );



  table.innerHTML = "";


  rows.forEach(
    (team, index) => {

      const gd =
        team.gf -
        team.ga;


      table.innerHTML += `

        <tr>

          <td>
            ${index + 1}
          </td>

          <td>
            <strong>
              ${team.name}
            </strong>
          </td>

          <td>
            ${team.played}
          </td>

          <td>
            ${team.win}
          </td>

          <td>
            ${team.draw}
          </td>

          <td>
            ${team.loss}
          </td>

          <td>
            ${team.gf}
          </td>

          <td>
            ${team.ga}
          </td>

          <td>
            ${gd}
          </td>

          <td>
            <strong>
              ${team.points}
            </strong>
          </td>

        </tr>

      `;

    }
  );

}



/* START */

render();
