import { ListItem, Typography } from "@mui/material"

// 履歴系の処理が長くなってきたので分割
export type History = {
    list: HistoryListItem[]
}

type HistoryListItem = {
    number?: number,
    time: number,
    age: number
}

// ミリ秒
const day = 86400000

export const generateHistoryElements = (history: History) => {
    if (!history.list.length) return []

    // 一次配列
    const tempArray: HistoryListItem[] = []
    // 二次元配列
    const converetHistoryList: HistoryListItem[][] = []
    history.list.forEach(a => {
        if (tempArray.length && a.age !== tempArray[0].age) {
            // 年が変わってる
            // tempArrayを二次元配列の一部にする
            converetHistoryList.push([...tempArray])
            // tempArrayの初期化
            tempArray.splice(0)
        }
        tempArray.push(a)
    })
    converetHistoryList.push(tempArray)

    return converetHistoryList.map(historys => <ListItem key={historys[0].time} sx={{ display: 'block' }}>
        <Typography component="span" sx={{ m: '0.5rem', display: 'inline-block' }}>{historys[0].age}年：</Typography>
        {historys.map(his => <Typography component="span" sx={{ m: '0.5rem', display: 'inline-block' }} key={his.time}>{his.number}</Typography>)}
    </ListItem>)
}

export const storeHistory = (history: History) => {
    if (history.list.length) {
        localStorage.setItem('karaHistory', JSON.stringify(history))
    }
}

export const intializeHistory = () => {
    const historyJson = localStorage.getItem('karaHistory')
    try {
        if (historyJson) {
            // 24時間経過してるやつを捨てる
            const history = { list: (JSON.parse(historyJson) as History).list.filter((his) => new Date().getTime() - his.time < day) }
            return history
        }
        return { list: [] }
    } catch {
        console.error('json parse error')
        throw (new Error('json parse error'))
    }
}