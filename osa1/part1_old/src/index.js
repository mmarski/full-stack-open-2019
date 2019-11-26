import React from 'react';
import ReactDOM from 'react-dom';

const Otsikko = (props) => (
    <h1>{props.kurssi}</h1>
)

const Part = (props) => (
    <p>{props.osa.nimi} {props.osa.tehtavia}</p>
)

const Content = (props) => (
    <React.Fragment>
        <Part osa={props.osat[0]} />
        <Part osa={props.osat[1]} />
        <Part osa={props.osat[2]} />
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
            <div>
                <Otsikko kurssi={kurssi.nimi} />
                <Content osat={kurssi.osat} />
                <Yhteensa osat={kurssi.osat} />
            </div>
            <div id="unicafe"></div>
        </div>
    )
}

ReactDOM.render(<App />, document.getElementById('root'));

class Button extends React.Component {
    constructor(props) {
        super(props)
        this.name = props.name
        this.onClick = props.onClick
    }

    render() {
        return <button onClick={this.onClick}>{this.name}</button>
    }
}

class Statistics extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            hyvat: 0,
            neutraalit: 0,
            pahat: 0
        }

        this.good = this.good.bind(this)
        this.neut = this.neut.bind(this)
        this.bad = this.bad.bind(this)
    }
}

class Statistic extends React.Component {
    constructor(props) {
        super(props)
        this.name = props.name
        this.state = {
            value: 0
        }

        this.plus = this.plus.bind(this)
    }
    plus() {
        this.setState({value: this.state.value + 1})
    }
}

class Unicafe extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            hyvat: 0,
            neutraalit: 0,
            pahat: 0
        }

        this.good = this.good.bind(this)
        this.neut = this.neut.bind(this)
        this.bad = this.bad.bind(this)
    }

    good() {
        this.setState({hyvat: this.state.hyvat + 1})
    }
    neut() {
        this.setState({neutraalit: this.state.neutraalit + 1})
    }
    bad() {
        this.setState({pahat: this.state.pahat + 1})
    }
    keskiarvo() {
        return (this.state.hyvat - this.state.pahat) / (this.state.hyvat + this.state.neutraalit + this.state.pahat)
    }
    positiivisia() {
        return (this.state.hyvat / (this.state.hyvat + this.state.neutraalit + this.state.pahat)) * 100 + " %"
    }
    
    render() {
        return (
            <div>
                <h1>Anna palautetta</h1>
                <Button name="Testinappi" onClick={this.good} />
                <button onClick={this.good}>Hyvä</button>
                <button onClick={this.neut}>Neutraali</button>
                <button onClick={this.bad}>Huono</button>
                <h2>Statistiikka</h2>
                <p>Hyvä {this.state.hyvat}</p>
                <p>Neutraali {this.state.neutraalit}</p>
                <p>Huono {this.state.pahat}</p>
                <p>Keskiarvo {this.keskiarvo()}</p>
                <p>Positiivisia {this.positiivisia()}</p>
            </div>
        )
    }
}
ReactDOM.render(<Unicafe />, document.getElementById('unicafe'));