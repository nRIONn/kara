import { Stack } from "@mui/material"
import { Link } from "react-router-dom"

const Footer = () =>
    <Stack spacing={3} justifyContent={"center"} direction={"row"}>
        <Link to={'/'}>カラオケ</Link>
        <Link to={'/hiragana'}>ひらがな</Link>
    </Stack>

export default Footer