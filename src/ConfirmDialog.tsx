import { DialogProps, Dialog, Box, Stack, Button } from "@mui/material";
// 削除前に誤操作防止のためダイアログを出す
export const ConfirmDialog = (
  props: DialogProps & {
    handleClick: () => void;
    handleCancel: () => void;
    title: string;
  },
) => {
  const { title, handleCancel, handleClick } = props;
  return (
    <Dialog {...props}>
      <Box padding={5}>
        {`${title}を削除します`}
        <Stack
          direction={"row"}
          spacing={2}
          justifyContent="center"
          marginTop={3}
        >
          <Button variant="contained" color="error" onClick={handleClick}>
            削除
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleCancel}>
            キャンセル
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
};
