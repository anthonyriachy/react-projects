// let users=[
//     {
//         name:"anthony",
//         age:20,
//         married:false
//     },
//     {
//         name:"joud",
//         age:20,
//         married:false
//     },
//     {
//         name:"pedro",
//         age:35,
//         married:true
//     },
// ]

let issuesDB = [
    {
    id: 1, status: 'New', owner: 'Ravan', effort: 5,
    created: new Date('2019-01-15'), due: undefined,
    title: 'Error in console when clicking Add',
    },

    {
    id: 2, status: 'Assigned', owner: 'Eddie', effort: 14,
    created: new Date('2019-01-16'), due: new Date('2019-02-01'),
    title: 'Missing bottom border on panel',
    },

    {
    id: 3, status: 'Assigned', owner: 'Eddie', effort: 14,
    created: new Date('2019-01-16'), due: new Date('2019-02-01'),
    title: 'Missing bottom border on panel',
    }
   ];

module.exports={issuesDB};
