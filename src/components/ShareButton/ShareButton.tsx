import { useState } from 'react';

import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import Snackbar from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';
import ShareIcon from '@mui/icons-material/Share';

import './sharebutton.css';

type Props = {
  url: string;
};



export default ({ url }: Props) => {
  const [open, setOpen] = useState(false);
  const copyUrl = () => {
      console.log(url);
      navigator.clipboard.writeText(url)
      setOpen(true)
  }

  return (
  <>
   <Box sx={{ '& > :not(style)': { m: 1 } }} className="BoxShareButton">
      <Fab size="small" color="primary" aria-label="Partager" onClick={copyUrl}>
        <ShareIcon  />
      </Fab>
   </Box>
   <Snackbar
        open={open}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        autoHideDuration={6000}
        onClose={ () => setOpen(false) }
     >
       <SnackbarContent
            style={{
              backgroundColor:'#1976d2',
            }}
            message={<span id="client-snackbar">Lien de partage copié ✓ </span>}
          />
     </Snackbar>
   </>
  )
};
