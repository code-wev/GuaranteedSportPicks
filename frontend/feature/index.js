// Auth API hooks
export {
  useRegisterMutation,
  useLoginMutation,
  useChangePasswordMutation,
  useForgetPasswordMutation,
  useResetPasswordMutation,
  useUpdateAuthMutation,
  useVerifyEmailMutation,
  useResendVerificationEmailMutation,
} from "./AuthApi";

// User API hooks
export {
  useGetSingleUserQuery,
  useGetAllUserQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "./UserApi";

// Payment/Subscription API hooks
export {
  useCreateSubscriptionMutation,
  useGetMySubscriptionQuery,
  useGetMySubscriptionHistoryQuery,
  useCancelSubscriptionMutation,
} from "./PaymentApi";

// Picks API hooks
export {
  useCreatePicksMutation,
  useUpdatePicksMutation,
  useDeletePicksMutation,
  useDeleteManyPicksMutation,
  useGetManyPicksQuery,
  useGetPicksByIdQuery,
} from "./PicksApi";

// Affiliate API hooks
export {
  useCreateAffiliateMutation,
  useUpdateAffiliateMutation,
  useDeleteAffiliateMutation,
  useDeleteManyAffiliateMutation,
  useGetManyAffiliateQuery,
  useGetAffiliateByIdQuery,
} from "./AffiliateApi";

// Newslatter API hooks
export {
  useCreateNewslatterMutation,
  useUpdateNewslatterMutation,
  useGetManyNewslatterQuery,
  useGetNewslatterByIdQuery,
} from "./NewslatterApi";