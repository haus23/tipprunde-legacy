import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { toast } from '@/utils/toast';

export default function DashboardRoute() {
  return (
    <div>
      <Heading>Dashboard</Heading>
      <div className="grid place-items-center gap-y-4">
        <Button variant="outline" onClick={() => toast('Default Message')}>
          Default
        </Button>
        <Button variant="outline" onClick={() => toast.info('Info Message')}>
          Info
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.warning('Warning Message')}
        >
          Warning
        </Button>
        <Button variant="outline" onClick={() => toast.error('Error Message')}>
          Error
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.success('Success Message')}
        >
          Success
        </Button>
      </div>
    </div>
  );
}
