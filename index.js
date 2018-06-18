var request = require('request')
var moment  = require('moment')

const url = 'http://worldcup.sfg.io/matches/today'

request(url, (err, res, body)  => {
  const matches = JSON.parse(body)
  console.log('')
  console.log('2018 World Cup Matches -', moment().format('dddd MMM Do'))
  console.log('')
  matches.map(match => {
      const time = timeMap(match.status, match.time)
      const goals = getGoals(match);
      console.log('--------------------------------------')
      console.log('')
      console.log(`${match.home_team.code} ${match.home_team.goals} - ${match.away_team.code} ${match.away_team.goals} ${time} :: ${moment(match.datetime).format('LT')}`)
      if(goals.length > 0){
        console.log(' ')
        console.log('GOALS:')
        goals.map(goal => console.log(' ', goal.time, '-', goal.team, ':', goal.player))
      }

      console.log('')
  });
  console.log('--------------------------------------')
});

function timeMap(status, time){
  if(status === 'in progress'){
    return `(${time})`
  }else if(status === 'completed'){
    return '(FT)'
  }else {
    return ''
  }
}

function getGoals(match){
  const homeGoals = match.home_team_events.filter( event => event.type_of_event === 'goal')
                         .map(event => { return {
                           time: event.time,
                           team: match.home_team.code,
                           player: event.player
                         } } )

  const awayGoals = match.away_team_events.filter(event => event.type_of_event === 'goal')
                         .map(event => { return {
                           time: event.time,
                           team: match.away_team.code,
                           player: event.player,
                          } } )

  return homeGoals.concat(awayGoals).sort( (a, b) => {
    return parseInt(a.time.replace("\'", "")) - parseInt(b.time.replace("\'", ""))
  });
}
