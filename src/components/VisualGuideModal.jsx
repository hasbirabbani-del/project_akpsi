import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { BookOpen, CheckCircle2, Package, Layers, Scissors, Tag } from 'lucide-react';

const getStepIcon = (imageType) => {
  switch (imageType) {
    case 'bubble-wrap': return <Package className="w-12 h-12 text-blue-600" />;
    case 'center-placement': return <Layers className="w-12 h-12 text-green-600" />;
    case 'dunnage': return <Package className="w-12 h-12 text-amber-600" />;
    case 'h-seal': return <Scissors className="w-12 h-12 text-purple-600" />;
    case 'label': return <Tag className="w-12 h-12 text-red-600" />;
    case 'foam-corner': return <Package className="w-12 h-12 text-orange-600" />;
    case 'arrange': return <Layers className="w-12 h-12 text-teal-600" />;
    default: return <CheckCircle2 className="w-12 h-12 text-gray-600" />;
  }
};

const getStepColor = (imageType) => {
  switch (imageType) {
    case 'bubble-wrap': return 'bg-blue-50 border-blue-200';
    case 'center-placement': return 'bg-green-50 border-green-200';
    case 'dunnage': return 'bg-amber-50 border-amber-200';
    case 'h-seal': return 'bg-purple-50 border-purple-200';
    case 'label': return 'bg-red-50 border-red-200';
    case 'foam-corner': return 'bg-orange-50 border-orange-200';
    case 'arrange': return 'bg-teal-50 border-teal-200';
    default: return 'bg-gray-50 border-gray-200';
  }
};

const VisualGuideModal = ({ box, onClose }) => {
  if (!box || !box.visualGuide) return null;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-white max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-gray-900 text-xl">
            <BookOpen className="w-6 h-6 text-[#1A73E8]" />
            {box.visualGuide.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          {/* Box Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm font-semibold text-blue-900 mb-2">Box: {box.name}</p>
            <p className="text-xs text-blue-700">Dimensi: {box.innerDim} • Kapasitas: {box.capacityL}L</p>
            <p className="text-xs text-blue-700">Lokasi: {box.location}</p>
          </div>
          
          {/* Steps with Dummy Images */}
          {box.visualGuide.steps && box.visualGuide.steps.length > 0 ? (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Langkah-langkah Pengepakan:</h3>
              <div className="grid grid-cols-2 gap-4">
                {box.visualGuide.steps.map((step) => (
                  <div key={step.number} className={`border rounded-lg p-4 ${getStepColor(step.image)}`}>
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center border-2 border-current">
                          {getStepIcon(step.image)}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-white px-2 py-1 rounded-full text-xs font-bold text-gray-900">Langkah {step.number}</span>
                        </div>
                        <p className="text-sm text-gray-800 font-medium">{step.instruction}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Tidak ada panduan visual untuk box ini</p>
            </div>
          )}
          
          {/* Special Handling Tags */}
          {box.specialHandlingTags && box.specialHandlingTags.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-amber-900 mb-2">Perhatian Khusus:</p>
              <div className="flex flex-wrap gap-2">
                {box.specialHandlingTags.map((tag, idx) => (
                  <span key={idx} className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-end pt-4 border-t border-gray-200 mt-6">
          <Button onClick={onClose} className="bg-[#1A73E8] hover:bg-[#1669C1]">
            Tutup
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VisualGuideModal;
