import {Router} from 'express'
import AppVersion from '../models/app_version.js'
import {numberToNumberCode} from '../models/number_to_number_code.js'

const router = Router()

// Main page
const list = async (req, res)  => {
    console.log(`app versions list`)

    const platform = req.query.platform // (required|string|in:ios,web)
    const page = req.query.page ?? 1     // (int|nullable|min:1)
    const perPage = req.query.per_page ?? 10 // (int|nullable|min:1|max:50)
    const afterNumber = req.query.after_number  // (nullable|string)
    const beforeNumber = req.query.before_number // (nullable|string)
    const language = req.query.language // (nullable|string|in:ru,uk,en)
    const sort = req.query.sort  ?? 'desc'       // (nullable|string|in:asc,desc == default)

    try { 
        var versions = [];
        var total = 0;   

        if (afterNumber == undefined && beforeNumber == undefined) {
            console.log(`app versions list - afterNumber == undefined && beforeNumber == undefined`)
            total = await AppVersion.find()
                .sort({ number_code: sort })
                .skip((page-1)*perPage)
                .countDocuments()

            versions = await AppVersion.find()
                .sort({ number_code: sort })
                .skip((page-1)*perPage)
                .limit(perPage);
        } else if (beforeNumber != undefined) {
            const numberCode = numberToNumberCode(beforeNumber)
            console.log(`app versions list - beforeNumber: ${numberCode}`)
            total = await AppVersion.find()
                .sort({ number_code: sort })
                .where('number_code').lte(numberCode)
                .skip((page-1)*perPage)
                .countDocuments()

            versions = await AppVersion.find()
                .sort({ number_code: sort })
                .where('number_code').lte(numberCode)
                .skip((page-1)*perPage)
                .limit(perPage);
        } else if (afterNumber != undefined) {
            const numberCode = numberToNumberCode(afterNumber)
            console.log(`app versions list - afterNumber: ${numberCode}`)
            total = await AppVersion.find()
                .sort({ number_code: sort })
                .where('number_code').gt(numberCode)
                .skip((page-1)*perPage)
                .countDocuments()

            versions = await AppVersion.find()
                .sort({ number_code: sort })
                .where('number_code').gt(numberCode)
                .skip((page-1)*perPage)
                .limit(perPage);
        }

        const response = {
            success: true,
            code: 200,
            data: {
                total: total,
                page: page,
                per_page: perPage,
                versions: versions
            }
        }

        res.json(response)
    } catch (error) {
        console.log(`app versions list, error: ${error}`)
        const response = {
            success: false,
            code: 355,
            error: `Failed to get versions, error: ${error}`
        }
        res.status(response.code).json(response)
    }
}

router.get('', list)

function insertAppVersions() {
    AppVersion.insertMany([
        {
            number: "1.0.24",
            number_code: 0,
            description: "Видалення російської мови",
            updates: "- видалена російська мова",
            is_actual: 1,
            is_minimal: 0,
            created_at: "2022-12-14 10:39:25"
        },
        {
            number: "1.0.23",
            number_code: 0,
            description: "Точність інформації є дуже важливою у нашій справі, тому ми зробили заповнення і редагування особистого профіля ще простішим для вас! Funny description 🤬",
            updates: "- update 1\r\n- update 2\r\n- update 3",
            is_actual: 0,
            is_minimal: 0,
            created_at: "2022-11-11 13:11:24"
        },
        {
            number: "1.0.22",
            number_code: 0,
            description: "Підрихтували кілька елементів у дизайні застосунку та сподіваємося, що ви відкриватимете його тільки, щоб помилуватися своєю анкетою або похвалитися друзям😎\r\n\r\nТакож, з'явилася можливість запросити повторний код із СМС при вході до застосунку. Це зроблено на випадок помилки або просто якщо вам не сподобалися цифри у першому коді😉",
            updates: null,
            is_actual: 0,
            is_minimal: 0,
            created_at: "2022-11-11 13:10:44"
        },
        {
            number: "1.0.20",
            number_code: 0,
            description: "Користуватися додатком MineGuard дуже легко та зрозуміло навіть нашим бабусям i дiдусям. Але ми постійно знаходимо, що вдосконалити😎 Зробили інтерфейс ще більш функціональним та приємним у використанні.",
            updates: null,
            is_actual: 0,
            is_minimal: 0,
            created_at: "2022-11-11 13:10:27"
        },
        {
            number: "1.0.19",
            number_code: 0,
            description: "Користуватися додатком MineGuard дуже легко та зрозуміло навіть нашим бабусям i дiдусям. Але ми постійно знаходимо, що вдосконалити😎 Зробили інтерфейс ще більш функціональним та приємним у використанні.",
            updates: null,
            is_actual: 0,
            is_minimal: 0,
            created_at: "2022-11-11 13:10:12"
        },
        {
            number: "1.0.18",
            number_code: 0,
            description: "Користуватися додатком MineGuard дуже легко та зрозуміло навіть нашим бабусям i дiдусям. Але ми постійно знаходимо, що вдосконалити😎 Зробили інтерфейс ще більш функціональним та приємним у використанні.",
            updates: null,
            is_actual: 0,
            is_minimal: 0,
            created_at: "2022-11-11 13:09:55"
        },
        {
            number: "1.0.17",
            number_code: 0,
            description: "Користуватися додатком MineGuard дуже легко та зрозуміло навіть нашим бабусям i дiдусям. Але ми постійно знаходимо, що вдосконалити😎 Зробили інтерфейс ще більш функціональним та приємним у використанні.",
            updates: null,
            is_actual: 0,
            is_minimal: 0,
            created_at: "2022-11-11 13:09:37"
        },
        {
            number: "1.0.16",
            number_code: 0,
            description: "Користуватися додатком MineGuard дуже легко та зрозуміло навіть нашим бабусям i дiдусям. Але ми постійно знаходимо, що вдосконалити😎 Зробили інтерфейс ще більш функціональним та приємним у використанні.",
            updates: null,
            is_actual: 0,
            is_minimal: 0,
            created_at: "2022-11-11 13:09:19"
        },
        {
            number: "1.0.15",
            number_code: 0,
            description: "Користуватися додатком MineGuard дуже легко та зрозуміло навіть нашим бабусям i дiдусям. Але ми постійно знаходимо, що вдосконалити😎 Зробили інтерфейс ще більш функціональним та приємним у використанні.",
            updates: null,
            is_actual: 0,
            is_minimal: 0,
            created_at: "2022-11-11 13:08:58"
        },
        {
            number: "1.0.14",
            number_code: 0,
            description: "Додали на екран реєстрації можливість зв'язатися із підтримкою. Підтримуємо вас не лише на вулицях міста, а й онлайн 😉",
            updates: null,
            is_actual: 0,
            is_minimal: 0,
            created_at: "2022-11-11 13:08:33"
        },
        {
            number: "1.0.13",
            number_code: 0,
            description: "Пофіксили \"вильоти\" з застосунку. Вилітають тепер тільки Хаймарси по складах, а в нас все працює ідеально",
            updates: null,
            is_actual: 0,
            is_minimal: 0,
            created_at: "2022-11-11 13:08:15"
        },
        {
            number: "1.0.12",
            number_code: 0,
            description: "Захисти себе та рідних за лічені хвилини. Оформити передплату стало ще простіше",
            updates: null,
            is_actual: 0,
            is_minimal: 0,
            created_at: "2022-11-11 13:07:53"
        },
        {
            number: "1.0.11",
            number_code: 0,
            description: "Захисти себе та рідних за лічені хвилини. Оформити передплату стало ще простіше",
            updates: null,
            is_actual: 0,
            is_minimal: 0,
            created_at: "2022-11-11 13:07:33"
        },
        {
            number: "1.0.8",
            number_code: 0,
            description: "Пофіксили \"вильоти\" з застосунку. Вилітають тепер тільки Хаймарси по складах, а в нас все працює ідеально",
            updates: null,
            is_actual: 0,
            is_minimal: 0,
            created_at: "2022-11-11 13:06:38"
        },
        {
            number: "1.0.7",
            number_code: 0,
            description: "Пофіксили \"вильоти\" з застосунку. Вилітають тепер тільки Хаймарси по складах, а в нас все працює ідеально",
            updates: null,
            is_actual: 0,
            is_minimal: 0,
            created_at: "2022-11-11 13:06:19"
        },
        {
            number: "1.0.6",
            number_code: 0,
            description: "?",
            updates: null,
            is_actual: 0,
            is_minimal: 0,
            created_at: "2022-11-11 13:05:57"
        },
        {
            number: "1.0.4",
            number_code: 0,
            description: "?",
            updates: null,
            is_actual: 0,
            is_minimal: 0,
            created_at: "2022-11-11 13:05:34"
        },
        {
            number: "1.0.3",
            number_code: 0,
            description: "?",
            updates: null,
            is_actual: 0,
            is_minimal: 0,
            created_at: "2022-11-11 13:05:11"
        },
        {
            number: "1.0.2",
            number_code: 0,
            description: "?",
            updates: null,
            is_actual: 0,
            is_minimal: 0,
            created_at: "2022-11-11 13:04:26"
        },
        {
            number: "1.0.0",
            number_code: 0,
            description: "Тест",
            updates: null,
            is_actual: 0,
            is_minimal: 1,
            created_at: "2022-11-10 19:04:08"
        }
    ])
}

//insertAppVersions();


export default router