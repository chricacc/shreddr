import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
    await prisma.tag.createMany({
        data: [{
            name: "downpicking"
        }, {
            name: "alternate-picking"
        }, {
            name: "rythm"
        }, {
            name: "lead"
        }, {
            name: "sweeping"
        }, {
            name: "legato"
        }, {
            name: "tapping"
        }, {
            name: "speed"
        }, {
            name: "endurance"
        },
        ]
    });
}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })