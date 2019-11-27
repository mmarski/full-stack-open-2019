import React from 'react';

const Header = (props) => {
    return (
        <h2>{props.course}</h2>
    )
}

const Part = (props) => {
    return (
        <p>
            {props.part} {props.exercises}
        </p>
    )
}

const Content = (props) => {
    return (
        <div>
            {props.parts.map(p => <Part key={p.id} part={p.name} exercises={p.exercises} />)}
        </div>
    )
}

const Total = (props) => {
    
    function sum() {
        let tot = props.parts.reduce((acc, curr) => {
            //console.log("acc", acc, "curr", curr)
            return acc + curr.exercises
        }, 0)

        
        /*props.parts.forEach(element => {
            tot += element.exercises
        });*/
        return tot
    }
    return (
        <b>Number of exercises {sum()}</b>
    )
}

const Course = ({course}) => {
    return (
        <>
        <Header course={course.name}></Header>
        <Content parts={course.parts}></Content>
        <Total parts={course.parts} />
        </>
    )
}

export default Course;