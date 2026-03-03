import Employeeapi from '../../api/Employeeapi';
import Errorpanel from '../../shared/Errorpanel';
import { useEmployeeDetails } from '../../zustand/useEmployeeDetails';
import { Button, Card, Group, Loadingoverlay } from '@nayeshdaggula/tailify';
import { IconArrowLeft } from '@tabler/icons-react';
import React, { useCallback, useEffect, useState, lazy, Suspense } from 'react';
import { toast } from 'react-toastify';

// const Sharedpermissionlist = dynamic(() => import('./Sharedpermissionlist'), { ssr: false })
const Sharedpermissionlist = lazy(() => import('./Sharedpermissionlist'));

function Permissionpopup({ closePermissionsModel, roleId, reloadGetRolesInfo }) {
  const access_token = useEmployeeDetails(state => state.access_token);

  const [mainPages, setMainPages] = useState([]);
  const updateMainPages = (value) => {
    setMainPages(value);

    if (value.includes('employee_page') !== mainPages?.includes('employee_page')) {
      if (value.includes('employee_page')) {
        const defaults = [
          'add_employee',
          'edit_employee',
          'delete_employee',
          'view_employee',
          'personalinfo_tab',
          // 'change_password_tab'
        ];
        setEmployeePage(prev => [...new Set([...prev, ...defaults])]);
      } else {
        setEmployeePage([]);
      }
    }

    if (value.includes('refund_page') !== mainPages?.includes('refund_page')) {
      if (value.includes('refund_page')) {
        const defaults = [];
        setRefundPage(prev => [...new Set([...prev, ...defaults])]);
      } else {
        setRefundPage([]);
      }
    }

    if (value.includes('project_allocation') !== mainPages?.includes('project_allocation')) {
      if (value.includes('project_allocation')) {
        const defaults = [
          'save_project_allocation',
        ];
        setProjectAllocation(prev => [...new Set([...prev, ...defaults])]);
      } else {
        setProjectAllocation([]);
      }
    }

    if (value.includes('reward_records_page') !== mainPages?.includes('reward_records_page')) {
      if (value.includes('reward_records_page')) {
        const defaults = [
          'view_reward_records',
        ];
        setRewardRecordsPage(prev => [...new Set([...prev, ...defaults])]);
      } else {
        setRewardRecordsPage([]);
      }
    }

    if (value.includes('ageing_page') !== mainPages?.includes('ageing_page')) {
      if (value.includes('ageing_page')) {
        const defaults = [
          'update_loan_details',
          'view_ageing_details',
        ];
        setAgeingPage(prev => [...new Set([...prev, ...defaults])]);
      } else {
        setAgeingPage([]);
      }
    }

    if (value.includes('assigning_settings') !== mainPages?.includes('assigning_settings')) {
      if (value.includes('assigning_settings')) {
        const defaults = [
          'discount_assigning',
          'booking_date_assigning'
        ];
        setAssigningSetting(prev => [...new Set([...prev, ...defaults])]);
      } else {
        setAssigningSetting([]);
      }
    }

    if (value.includes('leads_page') !== mainPages?.includes('leads_page')) {
      if (value.includes('leads_page')) {
        const defaults = [
          'add_lead',
          'assign_bulk_leads_to_employee',
          'download_lead_template',
          'upload_bulk_leads',
          'view_lead',
          'edit_lead',
          'delete_lead',
          'transfer_lead',
          'assign_lead',
          'update_lead_stage',
          'convert_lead_to_customer',
          'lead_documents',
          'add_folder_in_document_in_lead',
          'upload_file_in_lead',
          'view_file_in_lead',
          'delete_file_in_lead',
          'delete_folder_in_lead',
          'lead_notes',
          'add_notes_in_lead',
          'generate_cost_sheet',
        ];
        setLeadsPage(prev => [...new Set([...prev, ...defaults])]);
      } else {
        setLeadsPage([]);
      }
    }

    if (value.includes('flats_page') !== mainPages?.includes('flats_page')) {
      if (value.includes('flats_page')) {
        const defaults = ['add_flat',
          'assign_flat_to_customer',
          'edit_flat',
          'delete_flat',
          'view_flat',
          'edit_flat_image_single_flat',
          'flat_info_single_flat',
          'customer_flat_single_flat',
          'documents_single_flat',

          'add_folder_in_document_in_flat',
          'updload_file_in_flat',
          'delete_folder_in_flat',
          'view_file_in_flat',
          'delete_file_in_flat',

          'payments_single_flat',
          'notes_single_flat',
          'activities_single_flat',

          'download_flat_excel',
          'upload_flat_excel',
          'export_flat_to_excel',
          'upload_sale_deed_template',
          'download_sale_deed'
        ];
        setFlatsPage(prev => [...new Set([...prev, ...defaults])]);
      } else {
        setFlatsPage([]);
      }
    }

    if (value.includes('customers_page') !== mainPages?.includes('customers_page')) {
      if (value.includes('customers_page')) {
        const defaults = ['add_customer',
          'edit_customer',
          'view_single_customer',
          'delete_customer',
          'uploading_customer_image_in_single_customer',
          'other_info_single_customer',
          'flats_info_single_customer',
          'payments_info_single_customer',
          'documents_single_customer',

          'add_folder_in_document_in_customer',
          'upload_file_in_customer',
          'delete_folder_in_customer',
          'view_file_in_customer',
          'delete_file_in_customer',

          'notes_single_customer',
          'add_notes_single_customer',
          'activities_single_customer',

          'download_customer_excel',
          'upload_customer_excel',
          'export_customer_to_excel',

        ];
        setCustomersPage(prev => [...new Set([...prev, ...defaults])]);
      } else {
        setCustomersPage([]);
      }
    }

    if (value.includes('payments_page') !== mainPages?.includes('payments_page')) {
      if (value.includes('payments_page')) {
        const defaults = ['add_payment',
          'download_payment_excel',
          'upload_payment_excel',
          'export_payment_to_excel',
          'view_payment',
          'edit_payment',
          'delete_payment',
          'view_single_payment',
          'print_all_payments',
          'print_single_payment',
          'cancel_booking'

        ];
        setPaymentsPage(prev => [...new Set([...prev, ...defaults])]);
      } else {
        setPaymentsPage([]);
      }
    }

    if (value.includes('settings_page') !== mainPages?.includes('settings_page')) {
      if (value.includes('settings_page')) {
        const defaults = ['company_info_tab',
          'update_company_info',
          'project_tab',
          'create_project',
          'update_project_info',
          'delete_project',
          'blocks_tab',
          'amenities_tab',
          'add_amenities',
          'edit_amenities',
          'delete_amenities',
          'backup_tab',
          'add_block',
          'edit_block',
          'delete_block',
          'group_owner_tab',
          'add_group_owner',
          'edit_group_owner',
          'global_tab',
          'reward_records_tab',
          'reward_records_add',
          'reward_records_edit',
          'lead_stage_tab',
          'lead_stage_add',
          'lead_stage_edit',
          'lead_stage_delete',
          'templates_tab',
          'template_upload',
          // 'delete_group_owner'
        ];
        setSettingsPage(prev => [...new Set([...prev, ...defaults])]);
      } else {
        setSettingsPage([]);
      }
    }

    if (value.includes('group_owner_default_page') !== mainPages?.includes('group_owner_default_page')) {
      if (value.includes('group_owner_default_page')) {
        const defaults = [
          'assign_group_owner_to_flat',
          'mortgage'
        ];
        setGroupOwnerDefaultPage(prev => [...new Set([...prev, ...defaults])]);
      } else {
        setGroupOwnerDefaultPage([]);
      }
    }

  }

  const [employeePage, setEmployeePage] = useState([]);
  const updateEmployeePage = (value) => {
    setEmployeePage(value);
    if (value.length > 0 && !(mainPages || []).includes('employee_page')) {
      setMainPages([...(mainPages || []), 'employee_page']);
    } else if (value.length === 0 && (mainPages || []).includes('employee_page')) {
      setMainPages((mainPages || []).filter(page => page !== 'employee_page'));
    }
  };

  const [refundPage, setRefundPage] = useState([]);
  const updateRefundPage = (value) => {
    setRefundPage(value);
    if (value.length > 0 && !(mainPages || []).includes('refund_page')) {
      setMainPages([...(mainPages || []), 'refund_page']);
    } else if (value.length === 0 && (mainPages || []).includes('refund_page')) {
      setMainPages((mainPages || []).filter(page => page !== 'refund_page'));
    }
  };


  const [projectAllocation, setProjectAllocation] = useState([]);
  const updateProjectAllocation = (value) => {
    setProjectAllocation(value);
    if (value.length > 0 && !(mainPages || []).includes('project_allocation')) {
      setMainPages([...(mainPages || []), 'project_allocation']);
    } else if (value.length === 0 && (mainPages || []).includes('project_allocation')) {
      setMainPages((mainPages || []).filter(page => page !== 'project_allocation'));
    }
  };

  const [rewardRecordsPage, setRewardRecordsPage] = useState([]);
  const updateRewardRecordsPage = (value) => {
    setRewardRecordsPage(value);
    if (value.length > 0 && !(mainPages || []).includes('reward_records_page')) {
      setMainPages([...(mainPages || []), 'reward_records_page']);
    } else if (value.length === 0 && (mainPages || []).includes('reward_records_page')) {
      setMainPages((mainPages || []).filter(page => page !== 'reward_records_page'));
    }
  };

  const [ageingPage, setAgeingPage] = useState([]);
  const updateAgeingPage = (value) => {
    setAgeingPage(value);
    if (value.length > 0 && !(mainPages || []).includes('ageing_page')) {
      setMainPages([...(mainPages || []), 'ageing_page']);
    } else if (value.length === 0 && (mainPages || []).includes('ageing_page')) {
      setMainPages((mainPages || []).filter(page => page !== 'ageing_page'));
    }
  };

  const [assigningSetting, setAssigningSetting] = useState([]);
  const updateAssigningSetting = (value) => {
    setAssigningSetting(value);
    if (value.length > 0 && !(mainPages || []).includes('assigning_settings')) {
      setMainPages([...(mainPages || []), 'assigning_settings']);
    } else if (value.length === 0 && (mainPages || []).includes('assigning_settings')) {
      setMainPages((mainPages || []).filter(page => page !== 'assigning_settings'));
    }
  };

  const [leadsPage, setLeadsPage] = useState([]);
  const updateLeadsPage = (value) => {
    setLeadsPage(value);
    if (value.length > 0 && !(mainPages || []).includes('leads_page')) {
      setMainPages([...(mainPages || []), 'leads_page']);
    } else if (value.length === 0 && (mainPages || []).includes('leads_page')) {
      setMainPages((mainPages || []).filter(page => page !== 'leads_page'));
    }
  };

  const [flatsPage, setFlatsPage] = useState([]);
  const updateFlatsPage = (value) => {
    setFlatsPage(value);
    if (value.length > 0 && !(mainPages || []).includes('flats_page')) {
      setMainPages([...(mainPages || []), 'flats_page']);
    } else if (value.length === 0 && (mainPages || []).includes('flats_page')) {
      setMainPages((mainPages || []).filter(page => page !== 'flats_page'));
    }
  };

  const [customersPage, setCustomersPage] = useState([]);
  const updateCustomersPage = (value) => {
    setCustomersPage(value)
    if (value.length > 0 && !(mainPages || []).includes('customers_page')) {
      setMainPages([...(mainPages || []), 'customers_page']);
    } else if (value.length === 0 && (mainPages || []).includes('customers_page')) {
      setMainPages((mainPages || []).filter(page => page !== 'customers_page'));
    }
  }

  const [paymentsPage, setPaymentsPage] = useState([]);
  const updatePaymentsPage = (value) => {
    setPaymentsPage(value)
    if (value.length > 0 && !(mainPages || []).includes('payments_page')) {
      setMainPages([...(mainPages || []), 'payments_page']);
    } else if (value.length === 0 && (mainPages || []).includes('payments_page')) {
      setMainPages((mainPages || []).filter(page => page !== 'payments_page'));
    }
  }

  const [settingsPage, setSettingsPage] = useState([])
  const updateSettingsPage = (value) => {
    setSettingsPage(value)
    if (value.length > 0 && !(mainPages || []).includes('settings_page')) {
      setMainPages([...(mainPages || []), 'settings_page']);
    } else if (value.length === 0 && (mainPages || []).includes('settings_page')) {
      setMainPages((mainPages || []).filter(page => page !== 'settings_page'));
    }
  }

  const [groupOwnerDefaultPage, setGroupOwnerDefaultPage] = useState([])
  const updateGroupOwnerDefaultPage = (value) => {
    setGroupOwnerDefaultPage(value)
    if (value.length > 0 && !(mainPages || []).includes('group_owner_default_page')) {
      setMainPages([...(mainPages || []), 'group_owner_default_page']);
    } else if (value.length === 0 && (mainPages || []).includes('group_owner_default_page')) {
      setMainPages((mainPages || []).filter(page => page !== 'group_owner_default_page'));
    }
  }


  const [isLoading, setIsLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState('');
  const updatePermissions = (roleId) => {
    setIsLoading(true);

    Employeeapi.post('rolesupdatepermissions', {
      mainPages: mainPages,
      employeePage: employeePage,
      customersPage: customersPage,
      projectAllocation: projectAllocation,
      leadsPage: leadsPage,
      flatsPage: flatsPage,
      paymentsPage: paymentsPage,
      settingsPage: settingsPage,
      groupOwnerDefaultPage: groupOwnerDefaultPage,
      ageingPage: ageingPage,
      assigningSetting: assigningSetting,
      refundPage: refundPage,
      rewardRecordsPage: rewardRecordsPage,
      roleId: roleId
    }, {
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${access_token}`
      }
    })
      .then(res => {
        let data = res.data;
        if (data.status === 'error') {
          toast.error(error.message);
          setIsLoading(false);
          return false;
        }
        toast.success("Permissions Updated Sucessfully");
        closePermissionsModel();
        setIsLoading(false);
        return false;
      })
      .catch(error => {
        setErrorMessages(error);
        setIsLoading(false)
        return false;
      })
  }

  async function getPermissions(roleId) {
    await Employeeapi.get('getrolespermissions', {
      params: {
        roleId: roleId
      },
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${access_token}`
      }
    })
      .then(res => {
        let data = res.data;
        if (data.status === 'error') {
          toast.error(data.message);
          setIsLoading(false);
          return false;
        }

        let permissions = data.permissionsData;
        setMainPages(permissions?.main_page ? permissions?.main_page : []);
        setEmployeePage(permissions?.employee_page ? permissions?.employee_page : []);
        setAgeingPage(permissions?.ageing_page ? permissions?.ageing_page : []);
        setProjectAllocation(permissions?.project_allocation ? permissions?.project_allocation : []);
        setAssigningSetting(permissions?.assigning_settings ? permissions?.assigning_settings : []);
        setPaymentsPage(permissions?.payments_page ? permissions?.payments_page : []);
        setRefundPage(permissions?.refund_page ? permissions?.refund_page : []);
        setRewardRecordsPage(permissions?.reward_records_page ? permissions?.reward_records_page : []);
        setLeadsPage(permissions?.leads_page ? permissions?.leads_page : []);
        setFlatsPage(permissions?.flats_page ? permissions?.flats_page : []);
        setCustomersPage(permissions?.customers_page ? permissions?.customers_page : []);
        setSettingsPage(permissions?.settings_page ? permissions?.settings_page : []);
        setGroupOwnerDefaultPage(permissions?.group_owner_default_page ? permissions?.group_owner_default_page : []);
        setIsLoading(false);
        return false;
      })
      .catch(error => {
        let finalresponse;
        if (error.response !== undefined) {
          finalresponse = {
            'message': error.message,
            'server_res': error.response.data
          };
        } else {
          finalresponse = {
            'message': error.message,
            'server_res': null
          };
        }
        setErrorMessages(finalresponse);
        setIsLoading(false)
        return false;
      })
  }

  useEffect(() => {
    setIsLoading(true)
    getPermissions(roleId)
  }, [roleId])

  return (
    <Card withBorder={false} padding={'0px'}>
      <Card.Section padding='0px' className='pb-3'>
        <Group justify="space-between" className='flex justify-between items-center'>
          <p className='max-sm:text-sm text-lg font-bold'>Permissions</p>
          <button
            onClick={closePermissionsModel}
            className="cursor-pointer group flex items-center px-3 py-2 border-[0.8px] border-[#0083bf] hover:bg-[#0083bf] hover:text-white text-[#0083bf] rounded-lg text-sm"
          >
            <IconArrowLeft size={20} className='group-hover:text-white text-[#0083bf]' />
            <span className="group-hover:text-white">Close</span>
          </button>
        </Group>
      </Card.Section>
      <Card.Section className="h-fit max-h-[60vh] overflow-auto" padding='0px'>
        <Suspense fallback={<div>Loading permissions...</div>}>
          <Sharedpermissionlist
            mainPages={mainPages ? mainPages : []}
            updateMainPages={updateMainPages}

            employeePage={employeePage ? employeePage : []}
            updateEmployeePage={updateEmployeePage}

            settingsPage={settingsPage ? settingsPage : []}
            updateSettingsPage={updateSettingsPage}

            customersPage={customersPage ? customersPage : []}
            updateCustomersPage={updateCustomersPage}

            projectAllocation={projectAllocation ? projectAllocation : []}
            updateProjectAllocation={updateProjectAllocation}

            flatsPage={flatsPage ? flatsPage : []}
            updateFlatsPage={updateFlatsPage}

            leadsPage={leadsPage ? leadsPage : []}
            updateLeadsPage={updateLeadsPage}

            paymentsPage={paymentsPage ? paymentsPage : []}
            updatePaymentsPage={updatePaymentsPage}

            ageingPage={ageingPage ? ageingPage : []}
            updateAgeingPage={updateAgeingPage}

            assigningSetting={assigningSetting ? assigningSetting : []}
            updateAssigningSetting={updateAssigningSetting}

            refundPage={refundPage ? refundPage : []}
            updateRefundPage={updateRefundPage}

            rewardRecordsPage={rewardRecordsPage ? rewardRecordsPage : []}
            updateRewardRecordsPage={updateRewardRecordsPage}

            groupOwnerDefaultPage={groupOwnerDefaultPage ? groupOwnerDefaultPage : []}
            updateGroupOwnerDefaultPage={updateGroupOwnerDefaultPage}
          />
        </Suspense>
      </Card.Section>
      <Card.Section padding='0px' className='pt-3 border-none'>
        <Group justify="flex-end">
          <Button className='!bg-[#0083bf] ] px-3 py-2' onClick={() => updatePermissions(roleId)}>
            Update Permissions
          </Button>
        </Group>
        {isLoading &&
          <Loadingoverlay visible={isLoading} />
        }
      </Card.Section>
      {errorMessages &&
        <Errorpanel errorMessages={errorMessages} setErrorMessages={setErrorMessages} />
      }
    </Card>
  )
}

export default Permissionpopup;