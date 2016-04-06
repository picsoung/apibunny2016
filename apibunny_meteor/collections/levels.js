Levels = new Mongo.Collection("levels");

var Schemas = {};

Schemas.Level = new SimpleSchema({
    name: {
        type: String,
        label: "name",
        max: 200
    },
    level_number: {
        type: Number,
        label: "Number of level",
        min: 0
    },
    puzzle: {
        type: String,
        label: "Puzzle"
    },
    solution: {
        type: String,
        label: "solution"
    },
    hint: {
        type: String,
        label: "hint"
    }
});

Levels.attachSchema(Schemas.Level);
