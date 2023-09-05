import { Button, Dialog, Stack, Typography } from "@mui/material";
import React from "react";


type RemoveDialogProps = {
    open: boolean
}

function RemoveDialog(props: RemoveDialogProps) {
    const { open } = props

    return <Dialog open={true}>
        <Typography>削除します</Typography>
        <Stack>
            <Button variant="contained" color="error">全部</Button>
            <Button variant="outlined" color="error">１つ</Button>
            <Button variant="outlined" color="secondary">キャンセル</Button>
            <Button>キャンセル</Button>
        </Stack>
    </Dialog>
}