import { Dialog, DialogContent } from "./ui/dialog";
import PropTypes from 'prop-types';

const ImagePreviowdialog = ({imagePreview,imageOpen,setImageOpen}) => {
    return (
        <div>
            <Dialog open={imageOpen} onOpenChange={setImageOpen}>
                <DialogContent>
                    <div className="w-full h-64 flex items-center justify-center">
                        <img src={imagePreview} className="object-cover w-full h-full rounded-md" alt="preview_img" />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
};

ImagePreviowdialog.propTypes = {
    imagePreview:PropTypes.string.isRequired,
    imageOpen: PropTypes.bool.isRequired,
    setImageOpen: PropTypes.func.isRequired,
};

export default ImagePreviowdialog;
