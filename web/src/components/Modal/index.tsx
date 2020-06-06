import React, { useState, useEffect, useCallback} from 'react';
import Modal from 'react-modal';
import refresh from '../../assets/refresh.png';
import './style.css';

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    width: '40%',
    height: '40%',
    transform             : 'translate(-50%, -50%)', 
    border: 'nonse'   ,
    backgroundColor: 'transparent'
  }
};


interface Props {
  modalOpen: (modal: Boolean) => void
}


const  ModalComponent: React.FC<Props> = ({ modalOpen }) => {

  const [modalIsOpen,setIsOpen] = useState(false);

  useEffect(() => {
    console.log(modalOpen)
  },[modalOpen])

  const onDrop = useCallback(item => {
      // const file = acceptedFiles[0]
      console.log('teste')
  }, [modalOpen])

  function openModal() {
    setIsOpen(true);
    setTimeout(() => {
      setIsOpen(false)
    }, 5000);
  }

  function closeModal(){
    setIsOpen(false);
  }

  return (          
      <Modal
        isOpen={modalIsOpen}        
        onRequestClose={closeModal} 
        style={customStyles}       
        contentLabel="Modal loading"
      >

        <div className="container-loading">
          <img src={refresh} alt="Loading" className="img-loading"/>
        </div>
        
      </Modal>    
  );
}

export default ModalComponent;