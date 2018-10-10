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
        <Osa osa={props.osa1} />
        <Osa osa={props.osa2} />
        <Osa osa={props.osa3} />
    </React.Fragment>
)

const Yhteensa = (props) => (
    <p>yhteensä {props.tehtavia1 + props.tehtavia2 + props.tehtavia3} tehtävää</p>
)

const App = () => {
    const kurssi = 'Half Stack -sovelluskehitys'
    const osa1 = {
        nimi: 'Reactin perusteet',
        tehtavia: 10
    }
    const osa2 = {
        nimi: 'Tiedonvälitys propseilla',
        tehtavia: 7
    }
    
    const osa3 = {
        nimi: 'Komponenttien tila',
        tehtavia: 14
    }
    return (
        <div>
            <Otsikko kurssi={kurssi} />
            <Sisalto osa1={osa1} osa2={osa2} osa3={osa3} />
            <Yhteensa tehtavia1={osa1.tehtavia} tehtavia2={osa2.tehtavia} tehtavia3={osa3.tehtavia} />
        </div>
    )
}

ReactDOM.render(<App />, document.getElementById('root'));
