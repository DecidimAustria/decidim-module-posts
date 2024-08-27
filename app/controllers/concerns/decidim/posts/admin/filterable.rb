# frozen_string_literal: true

require "active_support/concern"

module Decidim
  module Posts
    module Admin
      module Filterable
        extend ActiveSupport::Concern

        included do
          include Decidim::Admin::Filterable

          private

          # Comment about participatory_texts_enabled.
          def base_query
            return collection
          end

          def search_field_predicate
            :id_string_or_title_cont
          end

          def filters
            [
              # :category_eq
            ]
          end

          def filters_with_values
            {
              # category_eq: category_ids_hash(categories.first_class)
            }
          end

          # Cannot user `super` here, because it does not belong to a superclass
          # but to a concern.
          # def dynamically_translated_filters
          #   [:scope_id_eq, :category_id_eq, :valuator_role_ids_has]
          # end
        end
      end
    end
  end
end
