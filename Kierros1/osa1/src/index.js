import React from 'react';
import ReactDOM from 'react-dom';

const Otsikko = (props) => (
    <h1>{props.kurssi}</h1>
)

const Osa = (props) => (
    <p>{props.osa.nimi} {props.osa.tehtavia}</p>
)

const Sisalto = (props) => (
    <React.Fragment>
        <Osa osa={props.osat[0]} />
        <Osa osa={props.osat[1]} />
        <Osa osa={props.osat[2]} />
    </React.Fragment>
)

const Yhteensa = (props) => (
    <p>yhteensä {props.osat[0].tehtavia + props.osat[1].tehtavia + props.osat[2].tehtavia} tehtävää</p>
)

const App = () => {
    const kurssi = {
        nimi: 'Half Stack -sovelluskehitys',
        osat: [
            {
                nimi: 'Reactin perusteet',
                tehtavia: 10
            },
            {
                nimi: 'Tiedonvälitys propseilla',
                tehtavia: 7
            },
            {
                nimi: 'Komponenttien tila',
                tehtavia: 14
            }
        ]
    }
    return (
        <div>
            <Otsikko kurssi={kurssi.nimi} />
            <Sisalto osat={kurssi.osat} />
            <Yhteensa osat={kurssi.osat} />
        </div>
    )
}

ReactDOM.render(<App />, document.getElementById('root'));
