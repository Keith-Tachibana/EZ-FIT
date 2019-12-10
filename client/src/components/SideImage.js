import React from 'react';
import ProgressiveImage from 'react-progressive-bg-image';

function SideImage(props) {
    return (
        <ProgressiveImage
            src={`/model${props.imageNumber}.jpg`}
            placeholder={`/model${props.imageNumber}-low.jpg`}
            style={{
                width: '100%',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
            }}
        />
    );
}

export default React.memo(SideImage);