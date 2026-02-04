'use client';

import React from "react"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface SignupFormData {
  full_name: string;
  email: string;
  password: string;
  confirmPassword: string;
  gender: string;
  age_group: string;
  sector: string;
  agency: string;
  is_senior_citizen: boolean;
  is_abled: boolean;
  nationality: string;
  region: string;
  is_solo_parent: boolean;
  civil_status: string;
  office_affiliation: string;
  designation: string;
  address: string;
  phone_number: string;
  birthdate: string;
}

const NATIONALITIES = [
  'Filipino',
  'American',
  'Canadian',
  'British',
  'Australian',
  'Indian',
  'Chinese',
  'Japanese',
  'German',
  'French',
  'Spanish',
  'Italian',
  'Korean',
  'Vietnamese',
  'Thai',
  'Malaysian',
  'Indonesian',
  'Other',
];

const AGE_GROUPS = [
  '18-25',
  '26-35',
  '36-45',
  '46-55',
  '56-65',
  '65+',
];

const CIVIL_STATUS = [
  'Single',
  'Married',
  'Widowed',
  'Divorced',
  'Separated',
  'Annulled',
  'Domestic Partnership/Common-Law',
];

export function SignupForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState<SignupFormData>({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    age_group: '',
    sector: '',
    agency: '',
    is_senior_citizen: false,
    is_abled: true,
    nationality: '',
    region: '',
    is_solo_parent: false,
    civil_status: '',
    office_affiliation: '',
    designation: '',
    address: '',
    phone_number: '',
    birthdate: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof SignupFormData
  ) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSelectChange = (value: string, field: keyof SignupFormData) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleBooleanChange = (field: keyof SignupFormData, value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.full_name.trim()) {
      setError('Full Name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (!formData.gender) {
      setError('Gender is required');
      return false;
    }
    if (!formData.age_group) {
      setError('Age Group is required');
      return false;
    }
    if (!formData.nationality) {
      setError('Nationality is required');
      return false;
    }
    if (!formData.civil_status) {
      setError('Civil Status is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: formData.full_name,
          email: formData.email,
          password: formData.password,
          gender: formData.gender,
          age_group: formData.age_group,
          sector: formData.sector,
          agency: formData.agency,
          is_senior_citizen: formData.is_senior_citizen,
          is_abled: formData.is_abled,
          nationality: formData.nationality,
          region: formData.region,
          is_solo_parent: formData.is_solo_parent,
          civil_status: formData.civil_status,
          office_affiliation: formData.office_affiliation,
          designation: formData.designation,
          address: formData.address,
          phone_number: formData.phone_number,
          birthdate: formData.birthdate,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Signup failed');
        return;
      }

      // Redirect to login page
      router.push('/login');
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create Your Account</CardTitle>
        <CardDescription>Please fill in all required fields marked with *</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-800 text-sm">
              {error}
            </div>
          )}

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Basic Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="full_name">
                  Full Name / User Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="full_name"
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => handleInputChange(e, 'full_name')}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange(e, 'email')}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">
                  Password <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange(e, 'password')}
                  placeholder="Enter a password"
                  required
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword">
                  Confirm Password <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange(e, 'confirmPassword')}
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </div>
          </div>

          {/* Personal Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Personal Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="gender">
                  Gender <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.gender} onValueChange={(value) => handleSelectChange(value, 'gender')}>
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="age_group">
                  Age Group <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.age_group} onValueChange={(value) => handleSelectChange(value, 'age_group')}>
                  <SelectTrigger id="age_group">
                    <SelectValue placeholder="Select age group" />
                  </SelectTrigger>
                  <SelectContent>
                    {AGE_GROUPS.map((group) => (
                      <SelectItem key={group} value={group}>
                        {group}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="birthdate">
                  Birthdate <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="birthdate"
                  type="date"
                  value={formData.birthdate}
                  onChange={(e) => handleInputChange(e, 'birthdate')}
                  required
                />
              </div>

              <div>
                <Label htmlFor="civil_status">
                  Civil Status <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.civil_status} onValueChange={(value) => handleSelectChange(value, 'civil_status')}>
                  <SelectTrigger id="civil_status">
                    <SelectValue placeholder="Select civil status" />
                  </SelectTrigger>
                  <SelectContent>
                    {CIVIL_STATUS.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="nationality">
                  Nationality <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.nationality} onValueChange={(value) => handleSelectChange(value, 'nationality')}>
                  <SelectTrigger id="nationality">
                    <SelectValue placeholder="Select nationality" />
                  </SelectTrigger>
                  <SelectContent>
                    {NATIONALITIES.map((nat) => (
                      <SelectItem key={nat} value={nat}>
                        {nat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="region">
                  Region <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="region"
                  type="text"
                  value={formData.region}
                  onChange={(e) => handleInputChange(e, 'region')}
                  placeholder="Enter your region"
                />
              </div>

              <div>
                <Label htmlFor="address">
                  Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="address"
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange(e, 'address')}
                  placeholder="Enter your address"
                />
              </div>

              <div>
                <Label htmlFor="phone_number">
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone_number"
                  type="tel"
                  value={formData.phone_number}
                  onChange={(e) => handleInputChange(e, 'phone_number')}
                  placeholder="Enter your phone number"
                />
              </div>
            </div>
          </div>

          {/* Employment Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Employment Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sector">
                  Select Sector <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="sector"
                  type="text"
                  value={formData.sector}
                  onChange={(e) => handleInputChange(e, 'sector')}
                  placeholder="Enter sector"
                />
              </div>

              <div>
                <Label htmlFor="agency">
                  Agency <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="agency"
                  type="text"
                  value={formData.agency}
                  onChange={(e) => handleInputChange(e, 'agency')}
                  placeholder="Enter agency"
                />
              </div>

              <div>
                <Label htmlFor="office_affiliation">
                  Office/Affiliation <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="office_affiliation"
                  type="text"
                  value={formData.office_affiliation}
                  onChange={(e) => handleInputChange(e, 'office_affiliation')}
                  placeholder="Enter office/affiliation"
                />
              </div>

              <div>
                <Label htmlFor="designation">
                  Designation/Position <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="designation"
                  type="text"
                  value={formData.designation}
                  onChange={(e) => handleInputChange(e, 'designation')}
                  placeholder="Enter designation/position"
                />
              </div>
            </div>
          </div>

          {/* Special Categories */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Special Categories</h3>

            <div className="space-y-3">
              <div>
                <Label className="text-base">
                  Are you a Senior Citizen? <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-4 mt-2">
                  <Button
                    type="button"
                    variant={formData.is_senior_citizen ? 'default' : 'outline'}
                    onClick={() => handleBooleanChange('is_senior_citizen', true)}
                  >
                    Yes
                  </Button>
                  <Button
                    type="button"
                    variant={!formData.is_senior_citizen ? 'default' : 'outline'}
                    onClick={() => handleBooleanChange('is_senior_citizen', false)}
                  >
                    No
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-base">
                  Are you Abled? <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-4 mt-2">
                  <Button
                    type="button"
                    variant={formData.is_abled ? 'default' : 'outline'}
                    onClick={() => handleBooleanChange('is_abled', true)}
                  >
                    Yes
                  </Button>
                  <Button
                    type="button"
                    variant={!formData.is_abled ? 'default' : 'outline'}
                    onClick={() => handleBooleanChange('is_abled', false)}
                  >
                    No
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-base">
                  Are you a Solo Parent? <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-4 mt-2">
                  <Button
                    type="button"
                    variant={formData.is_solo_parent ? 'default' : 'outline'}
                    onClick={() => handleBooleanChange('is_solo_parent', true)}
                  >
                    Yes
                  </Button>
                  <Button
                    type="button"
                    variant={!formData.is_solo_parent ? 'default' : 'outline'}
                    onClick={() => handleBooleanChange('is_solo_parent', false)}
                  >
                    No
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={loading} size="lg">
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 hover:underline">
              Sign in here
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
