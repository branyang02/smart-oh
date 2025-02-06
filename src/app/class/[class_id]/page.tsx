const ClassPage = ({ params }: { params: { class_id: string } }) => {
    return (
        <div>
            <h1>Class ID: {params.class_id}</h1>
        </div>
    );
};

export default ClassPage;
