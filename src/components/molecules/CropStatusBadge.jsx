import Badge from '@/components/atoms/Badge';

const CropStatusBadge = ({ status }) => {
  const getStatusVariant = (status) => {
    const variants = {
      'Seeding': 'info',
      'Growing': 'secondary',
      'Flowering': 'warning',
      'Tuber Formation': 'primary',
      'Ready to Harvest': 'accent',
      'Harvested': 'success'
    };
    return variants[status] || 'default';
  };

  return (
    <Badge variant={getStatusVariant(status)}>
      {status}
    </Badge>
  );
};

export default CropStatusBadge;