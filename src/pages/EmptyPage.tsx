const EmptyPage = ({ title }: { title: string }) => {
    return (
        <div style={{ padding: '24px', textAlign: 'center' }}>
            <h2>{title}</h2>
            <p className="text-subtle" style={{ marginTop: '12px' }}>This page is currently under construction.</p>
        </div>
    );
};

export default EmptyPage;
