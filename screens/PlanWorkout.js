import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';

const WorkoutPlans = () => {
    const [name, setName] = useState('');
    const [exercises, setExercises] = useState([]);

    const handleAddExercise = () => {
        setExercises([...exercises, { name: '', sets: '', reps: '' }]);
    };

    const handleChangeExercise = (index, field, value) => {
        const newExercises = [...exercises];
        newExercises[index][field] = value;
        setExercises(newExercises);
    };

    const handleSaveWorkout = () => {
        const workoutPlan = { name, exercises };
    };

    return (
        <View>
            <Text>Workout Plan</Text>
            <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Name"
            />
            <Button title="Add Exercise" onPress={handleAddExercise} />
            {exercises.map((exercise, index) => (
                <View key={index}>
                    <TextInput
                        value={exercise.name}
                        onChangeText={value =>
                            handleChangeExercise(index, 'name', value)
                        }
                        placeholder="Name"
                    />
                    <TextInput
                        value={exercise.sets}
                        onChangeText={value =>
                            handleChangeExercise(index, 'sets', value)
                        }
                        placeholder="Sets"
                    />
                    <TextInput
                        value={exercise.reps}
                        onChangeText={value =>
                            handleChangeExercise(index, 'reps', value)
                        }
                        placeholder="Reps"
                    />
                </View>
            ))}
            <Button title="Save Workout" onPress={handleSaveWorkout} />
        </View>
    );
};

export default WorkoutPlans;
