"use client";

import { useState, useEffect, Suspense } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useSearchParams, useRouter } from 'next/navigation';
import Select from 'react-select';
import Link from 'next/link';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

// react-select style overrides for dark/light mode compatibility
const reactSelectStyles = {
  control: (base: any) => ({
    ...base,
    backgroundColor: 'transparent',
    borderColor: 'var(--input)',
    color: 'var(--foreground)',
    boxShadow: 'none',
    '&:hover': { borderColor: 'var(--ring)' },
  }),
  menu: (base: any) => ({
    ...base,
    backgroundColor: 'var(--background)',
    border: '1px solid var(--border)',
    zIndex: 50,
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isFocused ? 'var(--accent)' : 'transparent',
    color: state.isFocused ? 'var(--accent-foreground)' : 'var(--foreground)',
  }),
  singleValue: (base: any) => ({
    ...base,
    color: 'var(--foreground)',
  }),
  input: (base: any) => ({
    ...base,
    color: 'var(--foreground)',
  }),
};

// Zod Schema for validation
const formSchema = z.object({
  subject_id: z.string().min(1, "Subject is required"),
  semester: z.string().min(1, "Semester is required"),
  exam_type: z.string().optional(),
  slot: z.string().regex(/^[A-Z][0-9]{2}(\+[A-Z][0-9]{2})*$/, "Format: A11 or A11+A12").optional().or(z.literal('')),
  faculty: z.string().optional(),
  submitted_by: z.string().optional(),
});

function ContributeForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const defaultSubjectId = searchParams?.get('subject') || '';
  const typeParam = searchParams?.get('type');

  let selectedType: string | null = null;
  if (typeParam === 'pyq') selectedType = 'Question Paper';
  if (typeParam === 'studyMaterial') selectedType = 'Study Material';
  if (typeParam === 'assignment') selectedType = 'Assignment';

  const supabase = createClient();

  const [subjects, setSubjects] = useState<any[]>([]);
  const [semesters, setSemesters] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject_id: defaultSubjectId,
      semester: '',
      exam_type: 'Midterm',
      slot: '',
      faculty: '',
      submitted_by: '',
    }
  });

  const watchExamType = watch("exam_type");

  useEffect(() => {
    async function fetchData() {
      const { data: subData } = await supabase.from('subjects').select('*').order('code');
      if (subData) setSubjects(subData);

      const { data: semData, error: semError } = await supabase.from('semesters').select('*').order('name');
      if (semError) {
        toast.error("Failed to load semesters.");
      }
      if (semData) setSemesters(semData);
    }
    fetchData();
  }, [supabase]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }
    
    setLoading(true);
    const loadingToast = toast.loading("Uploading contribution...");

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `pending/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('resources-bucket')
        .upload(filePath, file);

      if (uploadError) throw new Error("File upload failed: " + uploadError.message);

      const { data: { publicUrl } } = supabase.storage
        .from('resources-bucket')
        .getPublicUrl(filePath);

      const examTypeFinal = selectedType === 'Question Paper' ? values.exam_type : 'General';

      const { error: dbError } = await supabase.from('contributions').insert([
        {
          subject_id: values.subject_id,
          semester: values.semester,
          exam_type: examTypeFinal,
          slot: values.slot,
          faculty: values.faculty,
          resource_type: selectedType,
          file_url: publicUrl,
          submitted_by: values.submitted_by,
          status: 'pending'
        }
      ]);

      if (dbError) throw new Error("Database error: " + dbError.message);

      toast.success("Contribution submitted successfully! Pending admin approval.", { id: loadingToast });
      router.push('/contribute'); // Reset selection
    } catch (err: any) {
      toast.error(err.message || 'An unexpected error occurred.', { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  if (!selectedType) {
    return (
      <div className="flex flex-col items-center justify-center mt-8">
        <h3 className="text-2xl font-bold mb-6">What would you like to contribute?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
          <Link href="/contribute?type=pyq" className="flex-1">
            <Card className="hover:border-primary transition-colors h-full cursor-pointer">
              <CardHeader>
                <CardTitle className="text-center text-lg">Question Paper</CardTitle>
                <CardDescription className="text-center">Midterm or Term End PYQs</CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/contribute?type=studyMaterial" className="flex-1">
            <Card className="hover:border-primary transition-colors h-full cursor-pointer">
              <CardHeader>
                <CardTitle className="text-center text-lg">Study Material</CardTitle>
                <CardDescription className="text-center">Notes, PPTs, or PDFs</CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/contribute?type=assignment" className="flex-1">
            <Card className="hover:border-primary transition-colors h-full cursor-pointer">
              <CardHeader>
                <CardTitle className="text-center text-lg">Assignment</CardTitle>
                <CardDescription className="text-center">Solved assignments or guides</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b mb-6">
        <div>
          <CardTitle>Contributing: {selectedType}</CardTitle>
          <CardDescription>Fill out the details below to upload your file.</CardDescription>
        </div>
        <Link href="/contribute" className="text-sm text-primary hover:underline">Change Type</Link>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label>Subject <span className="text-red-500">*</span></Label>
            <Controller
              name="subject_id"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  value={subjects.map(s => ({ value: s.id, label: `${s.code} - ${s.name}` })).find(o => o.value === field.value)}
                  onChange={(val: any) => field.onChange(val?.value)}
                  options={subjects.map(sub => ({ value: sub.id, label: `${sub.code} - ${sub.name}` }))}
                  placeholder="-- Search or Select a Course --"
                  styles={reactSelectStyles}
                />
              )}
            />
            {errors.subject_id && <p className="text-sm text-red-500">{errors.subject_id.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Semester <span className="text-red-500">*</span></Label>
              <Controller
                name="semester"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    value={semesters.map(sem => ({ value: sem.name, label: sem.name })).find(o => o.value === field.value)}
                    onChange={(val: any) => field.onChange(val?.value)}
                    options={semesters.map(sem => ({ value: sem.name, label: sem.name }))}
                    placeholder="-- Select a Semester --"
                    styles={reactSelectStyles}
                  />
                )}
              />
              {errors.semester && <p className="text-sm text-red-500">{errors.semester.message}</p>}
            </div>

            {selectedType === 'Question Paper' && (
              <div className="space-y-2">
                <Label>Exam Type <span className="text-red-500">*</span></Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={watchExamType === 'Midterm' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => setValue('exam_type', 'Midterm')}
                  >
                    Midterm
                  </Button>
                  <Button
                    type="button"
                    variant={watchExamType === 'Endterm' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => setValue('exam_type', 'Endterm')}
                  >
                    Term End
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Slot (Optional)</Label>
              <Input
                {...register("slot")}
                placeholder="e.g. A11+A12"
              />
              {errors.slot && <p className="text-sm text-red-500">{errors.slot.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label>Faculty Name (Optional)</Label>
              <Input
                {...register("faculty")}
                placeholder="e.g. Dr. Name Surname"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Your Name/Email (Optional)</Label>
            <Input
              {...register("submitted_by")}
              placeholder="So we know who to thank!"
            />
          </div>

          <div className="space-y-2">
            <Label>File Upload (PDF/PPT) <span className="text-red-500">*</span></Label>
            <Input 
              type="file" 
              accept=".pdf,.ppt,.pptx" 
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
              className="cursor-pointer file:cursor-pointer file:text-primary file:font-semibold"
            />
          </div>

          <Button type="submit" className="w-full font-bold" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Contribution'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function ContributePage() {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h2 className="text-3xl font-bold mb-8">Contribute Material</h2>
      <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-xl"></div>}>
        <ContributeForm />
      </Suspense>
    </div>
  );
}
