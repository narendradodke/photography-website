import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { User, CheckCircle2, ArrowRight } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';
import { submitBooking } from '../../services/bookingService';
import { useUIStore } from '../../store/uiStore';
import { fadeUp } from '../../utils/animations';

const bookingSchema = z.object({
  full_name: z.string().min(2, 'Please enter your full name'),
  phone: z
    .string()
    .min(10, 'Please enter a valid 10-digit phone number')
    .regex(/^[0-9+\s-]{10,15}$/, 'Invalid phone number format'),
  package_tier: z.string().min(1, 'Please select a package'),
  event_date: z.string().min(1, 'Please select a preferred date'),
  message: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

export const Booking: React.FC = () => {
  const { selectedPackageId, setSelectedPackageId } = useUIStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successResult, setSuccessResult] = useState<{ id: string; message: string } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      package_tier: selectedPackageId,
      event_date: '',
      full_name: '',
      phone: '',
      message: '',
    },
  });

  const onSubmit = async (values: BookingFormValues) => {
    setIsSubmitting(true);
    try {
      const res = await submitBooking({
        full_name: values.full_name,
        phone: values.phone.startsWith('+91') ? values.phone : `+91 ${values.phone}`,
        package_tier: values.package_tier,
        event_date: values.event_date,
        message: values.message,
      });
      setSuccessResult({
        id: res.booking_id,
        message: res.message,
      });
      reset();
    } catch {
      // Handled in service fallback
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="booking" className="py-24 lg:py-32 bg-[#0E0E0E] dark:bg-[#0E0E0E] light:bg-[#FFFFFF] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <SectionHeading
          tag="Reservation"
          title="Reserve Your Shoot"
          highlightWord="Shoot"
          subtitle="Dates are limited to ensure complete focus on each couple and bespoke project. Reserve your date in advance."
        />

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-12 overflow-hidden bg-[#141414] dark:bg-[#141414] light:bg-[#F8F8F8] border border-neutral-800 dark:border-neutral-800 light:border-neutral-300 shadow-2xl"
        >
          {/* Left Side: Visual */}
          <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-[500px]">
            <img
              src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=85"
              alt="Destination Wedding"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-8 sm:p-10">
              <span className="font-cursive text-3xl sm:text-4xl text-[#D4AF37] mb-2">
                "Let's Capture Your Story"
              </span>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Every celebration is unique. Tell us about your plans, vision, and destination. We will tailor a package that fits your story.
              </p>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
            {successResult ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl text-white dark:text-white light:text-neutral-900 font-normal">
                  Booking Confirmed!
                </h3>
                <p className="text-sm text-neutral-400 dark:text-neutral-400 light:text-neutral-600 max-w-md mx-auto leading-relaxed">
                  {successResult.message}
                </p>
                <div className="inline-block p-3 rounded-md bg-black/40 border border-[#D4AF37]/40 text-xs font-mono text-[#D4AF37]">
                  Booking Reference: {successResult.id}
                </div>
                <div>
                  <button
                    onClick={() => setSuccessResult(null)}
                    className="mt-4 px-6 py-2.5 rounded-full bg-[#D4AF37] text-black text-xs font-semibold uppercase tracking-wider hover:bg-[#E6C558] transition-colors"
                  >
                    Make Another Booking
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-400 light:text-neutral-600 font-semibold mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <input
                      {...register('full_name')}
                      placeholder="e.g. Arjun & Riya Sharma"
                      className="w-full bg-[#1C1C1C] dark:bg-[#1C1C1C] light:bg-white border border-neutral-700 dark:border-neutral-700 light:border-neutral-300 text-white dark:text-white light:text-neutral-900 px-4 py-3 text-sm focus:outline-none focus:border-[#D4AF37] rounded-none"
                    />
                    <User className="absolute right-3.5 top-3.5 w-4 h-4 text-neutral-500" />
                  </div>
                  {errors.full_name && (
                    <p className="text-xs text-red-400 mt-1">{errors.full_name.message}</p>
                  )}
                </div>

                {/* Phone with +91 */}
                <div>
                  <label className="block text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-400 light:text-neutral-600 font-semibold mb-2">
                    Phone Number (WhatsApp) *
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-4 bg-neutral-800 dark:bg-neutral-800 light:bg-neutral-200 border border-r-0 border-neutral-700 dark:border-neutral-700 light:border-neutral-300 text-xs text-neutral-400 dark:text-neutral-400 light:text-neutral-700 font-semibold">
                      +91
                    </span>
                    <input
                      {...register('phone')}
                      placeholder="98765 43210"
                      className="w-full bg-[#1C1C1C] dark:bg-[#1C1C1C] light:bg-white border border-neutral-700 dark:border-neutral-700 light:border-neutral-300 text-white dark:text-white light:text-neutral-900 px-4 py-3 text-sm focus:outline-none focus:border-[#D4AF37] rounded-none"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-xs text-red-400 mt-1">{errors.phone.message}</p>
                  )}
                </div>

                {/* Package & Date in 2 Cols */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-400 light:text-neutral-600 font-semibold mb-2">
                      Select Package *
                    </label>
                    <select
                      {...register('package_tier')}
                      value={selectedPackageId}
                      onChange={(e) => setSelectedPackageId(e.target.value)}
                      className="w-full bg-[#1C1C1C] dark:bg-[#1C1C1C] light:bg-white border border-neutral-700 dark:border-neutral-700 light:border-neutral-300 text-white dark:text-white light:text-neutral-900 px-4 py-3 text-sm focus:outline-none focus:border-[#D4AF37] rounded-none"
                    >
                      <option value="basic">Basic (₹12,000)</option>
                      <option value="premium">Premium (₹22,000) — Most Popular</option>
                      <option value="luxury">Luxury (₹35,000)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-400 light:text-neutral-600 font-semibold mb-2">
                      Date of Shoot *
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        {...register('event_date')}
                        className="w-full bg-[#1C1C1C] dark:bg-[#1C1C1C] light:bg-white border border-neutral-700 dark:border-neutral-700 light:border-neutral-300 text-white dark:text-white light:text-neutral-900 px-4 py-3 text-sm focus:outline-none focus:border-[#D4AF37] rounded-none"
                      />
                    </div>
                    {errors.event_date && (
                      <p className="text-xs text-red-400 mt-1">{errors.event_date.message}</p>
                    )}
                  </div>
                </div>

                {/* Additional Message */}
                <div>
                  <label className="block text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-400 light:text-neutral-600 font-semibold mb-2">
                    Additional Details / Location
                  </label>
                  <textarea
                    {...register('message')}
                    rows={3}
                    placeholder="Tell us about the venue, ceremony details, or special requests..."
                    className="w-full bg-[#1C1C1C] dark:bg-[#1C1C1C] light:bg-white border border-neutral-700 dark:border-neutral-700 light:border-neutral-300 text-white dark:text-white light:text-neutral-900 px-4 py-3 text-sm focus:outline-none focus:border-[#D4AF37] rounded-none resize-none"
                  ></textarea>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-full bg-[#D4AF37] hover:bg-[#E6C558] text-black font-semibold text-xs uppercase tracking-[0.2em] transition-all duration-300 shadow-xl shadow-[#D4AF37]/20 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Processing Reservation...</span>
                  ) : (
                    <>
                      <span>Confirm Booking</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
