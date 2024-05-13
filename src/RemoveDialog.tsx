import { Button, Container, Dialog, Stack, Typography, } from "@mui/material"


type RemoveDialogProps = {
    isOpen: boolean
    close: () => void
    deleteHistory: () => void
    deleteAll: () => void
}

export default function RemoveDialog(props: RemoveDialogProps) {
    const { isOpen, close, deleteHistory, deleteAll } = props


    return <Dialog open={isOpen} >
        <Container sx={{ padding: 5 }}>
            <Stack spacing={4}>
                <Typography>削除します</Typography>
                <Stack direction={"row"} spacing={2}>
                    <Button variant="contained" color="error" onClick={deleteAll}>全部</Button>
                    <Button variant="outlined" color="error" onClick={deleteHistory}>直前だけ</Button>
                    <Button variant="outlined" color="secondary" onClick={close}>キャンセル</Button>
                </Stack>
            </Stack>
        </Container>
    </Dialog>
}