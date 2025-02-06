const ClassPage = ({ params }: { params: { class_id: string } }) => {
    return (
        <div>
            <h3>Class ID: {params.class_id}</h3>
        </div>
    );
};

export default ClassPage;
