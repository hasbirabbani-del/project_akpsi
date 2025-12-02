import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Package, CheckCircle2 } from 'lucide-react';
import { generatePdfLabels } from '../utils/pdfLabelGenerator';
import { toast } from '../hooks/use-toast';

const OrderReviewModal = ({ isOpen, orderData, currentHU, session, onOrderBaru }) => {
  const [isPrinted, setIsPrinted] = useState(false);
  const [printing, setPrinting] = useState(false);

  if (!orderData || !currentHU) return null;

  const { hu, salesOrder, clientName, itemCount, items, boxes } = orderData;

  const handlePrintLabel = () => {
    setPrinting(true);
    
    // Get selected and scanned boxes
    const selectedBoxes = currentHU.recommendations.boxes || boxes || [];
    
    // Check if no boxes selected
    if (!selectedBoxes.some(b => b.status === 'selected' && b.scanned)) {
      toast({
        title: 'Peringatan',
        description: 'Tidak ada box yang dipilih—mencetak 1 label default.',
        variant: 'default'
      });
    }
    
    // Generate PDF
    const pdfResult = generatePdfLabels({
      orderId: salesOrder,
      handlingUnit: currentHU,
      session: { clientId: currentHU.clientId },
      boxes: selectedBoxes,
      items: currentHU.items
    });
    
    if (pdfResult.success) {
      toast({
        title: 'Label dicetak',
        description: `${pdfResult.pageCount} halaman label telah diunduh dan dicetak.`
      });
      setIsPrinted(true);
    } else {
      toast({
        title: 'Error PDF',
        description: pdfResult.error || 'Gagal generate PDF',
        variant: 'destructive'
      });
    }
    
    setPrinting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent 
        className="bg-white max-w-md [&>button]:hidden"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-full">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <DialogTitle className="text-gray-900 text-xl">Order Review</DialogTitle>
          </div>
        </DialogHeader>
        
        {/* Order Summary */}
        <div className="space-y-4 my-4">
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Handling Unit:</span>
              <span className="font-semibold text-gray-900">{hu}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Sales Order:</span>
              <span className="font-semibold text-gray-900">{salesOrder}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Client:</span>
              <span className="font-semibold text-gray-900">{clientName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Items:</span>
              <span className="font-semibold text-gray-900">{itemCount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Boxes:</span>
              <span className="font-semibold text-gray-900">{boxes?.filter(b => b.status === 'selected').length || 0}</span>
            </div>
          </div>

          {/* Items Summary */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Items:</p>
            <div className="space-y-1">
              {items?.slice(0, 5).map((item, idx) => (
                <div key={idx} className="flex justify-between text-xs text-gray-600 bg-gray-50 rounded px-3 py-2">
                  <span>{item.name}</span>
                  <span className="font-medium">Qty: {item.qty}</span>
                </div>
              ))}
              {items?.length > 5 && (
                <p className="text-xs text-gray-500 text-center pt-1">+{items.length - 5} item lainnya</p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 mt-6">
          <Button
            onClick={handlePrintLabel}
            disabled={isPrinted || printing}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            {isPrinted ? (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Printed ✓
              </>
            ) : printing ? (
              'Mencetak...'
            ) : (
              'Print Label'
            )}
          </Button>
          
          <Button
            onClick={onOrderBaru}
            variant="outline"
            className="w-full border-gray-300 text-gray-700"
          >
            Order Baru
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderReviewModal;
